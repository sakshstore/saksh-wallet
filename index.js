const EventEmitter = require('events');
const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');
const WalletUser = require('./models/WalletUser');

const defaultConfig = require('./config/config');
const RecurringPayment = require('./models/RecurringPayment');




class Wallet extends EventEmitter {
    constructor(userModel = WalletUser, config = defaultConfig) {
        super();
        this.User = userModel;
        this.config = config;

        this.adminUserId = config.adminUserId;

    }

    async updateDailyLimit(user, amount) {
        const today = new Date().setHours(0, 0, 0, 0);
        if (new Date(user.lastTransactionDate).setHours(0, 0, 0, 0) !== today) {
            user.dailyTotal = 0;
            user.lastTransactionDate = Date.now();
        }

        if (user.dailyTotal + amount > user.dailyLimit) {
            throw new Error('Daily transaction limit exceeded');
        }

        user.dailyTotal += amount;
    }

    async updateBalance(userId, amount, currency, type, description, referenceNumber) {
        if (amount <= 0) {
            throw new Error('Amount must be greater than zero');
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            let user = await this.User.findOne({ userId }).session(session);
            if (!user) {
                user = new this.User({ userId });
            }

            await this.updateDailyLimit(user, amount);

            if (type === 'debit' && (!user.balances.has(currency) || user.balances.get(currency) < amount)) {
                throw new Error('Insufficient funds');
            }

            const newBalance = type === 'credit' ? (user.balances.get(currency) || 0) + amount : (user.balances.get(currency) || 0) - amount;
            user.balances.set(currency, newBalance);
            await user.save({ session });

            const transaction = new Transaction({
                userId,
                type,
                amount,
                currency,
                description,
                referenceNumber,
            });

            await transaction.save({ session });
            await session.commitTransaction();
            session.endSession();

            this.emit('transaction', {
                userId,
                type,
                amount,
                currency,
                description,
                referenceNumber,
                date: new Date(),
            });

            return user.balances.get(currency);
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

    async credit(userId, amount, currency, description, referenceNumber) {
        return this.updateBalance(userId, amount, currency, 'credit', description, referenceNumber);
    }

    async debit(userId, amount, currency, description, referenceNumber) {
        return this.updateBalance(userId, amount, currency, 'debit', description, referenceNumber);
    }


    calculateFee(amount) {
        for (const tier of this.feeStructure.tiers) {
            if (amount >= tier.minAmount && amount <= tier.maxAmount) {
                return (amount * tier.feePercentage) / 100;
            }
        }
        return (amount * this.feeStructure.default) / 100;
    }




    async sakshTransferFunds(fromUserId, toUserId, amount, currency, description, referenceNumber, customFeeCallback = null) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const feeAmount = this.sakshCalculateFee(amount, customFeeCallback);
            const totalDebitAmount = amount + feeAmount;

            await this.debit(fromUserId, totalDebitAmount, currency, `${description} (including fee)`, referenceNumber);
            await this.credit(toUserId, amount, currency, description, referenceNumber);
            await this.credit(this.adminUserId, feeAmount, currency, `Transfer fee from ${fromUserId} to ${toUserId}`, referenceNumber);

            await session.commitTransaction();
            session.endSession();

            this.emit('transfer', {
                fromUserId,
                toUserId,
                amount,
                currency,
                description,
                referenceNumber,
                feeAmount,
                adminUserId: this.adminUserId,
                date: new Date(),
            });

            return { fromUserId, toUserId, amount, currency, feeAmount, adminUserId: this.adminUserId };
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }




    async getBalance(userId, currency) {
        let user = await this.User.findOne({ userId });
        if (!user) {
            user = new this.User({ userId });
        }
        return user.balances.get(currency) || 0;
    }

    async getTransactionReport(userId) {
        return await Transaction.find({ userId });
    }

    async reverseTransaction(transactionId, session) {
        const originalTransaction = await Transaction.findById(transactionId).session(session);
        if (!originalTransaction) {
            throw new Error('Transaction not found');
        }

        const { userId, type, amount, currency, description, referenceNumber } = originalTransaction;

        let user = await this.User.findOne({ userId }).session(session);
        if (!user) {
            user = new this.User({ userId });
        }

        if (type === 'credit') {
            if (!user.balances.has(currency) || user.balances.get(currency) < amount) {
                throw new Error('Insufficient funds to reverse the transaction');
            }
            user.balances.set(currency, user.balances.get(currency) - amount);
        } else if (type === 'debit') {
            user.balances.set(currency, (user.balances.get(currency) || 0) + amount);
        } else {
            throw new Error('Invalid transaction type');
        }

        await user.save({ session });

        const reversedTransaction = new Transaction({
            userId,
            type: type === 'credit' ? 'debit' : 'credit',
            amount,
            currency,
            description: `Reversal of transaction ${transactionId}`,
            referenceNumber: `REV-${referenceNumber}`,
        });

        await reversedTransaction.save({ session });

        this.emit('transaction', {
            userId,
            type: reversedTransaction.type,
            amount,
            currency,
            description: reversedTransaction.description,
            referenceNumber: reversedTransaction.referenceNumber,
            date: new Date(),
        });

        return reversedTransaction;
    }

    async reverseMultipleTransactions(transactionIds) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const reversedTransactions = [];
            for (const transactionId of transactionIds) {
                const reversedTransaction = await this.reverseTransaction(transactionId, session);
                reversedTransactions.push(reversedTransaction);
            }

            await session.commitTransaction();
            session.endSession();

            return reversedTransactions;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }






    async sakshCreateRecurringPayment(userId, toUserId, amount, currency, description, referenceNumber, interval, feeCallback = null) {
        const nextPaymentDate = this.sakshCalculateNextPaymentDate(interval);
        const recurringPayment = new RecurringPayment({
            userId,
            toUserId,
            amount,
            currency,
            description,
            referenceNumber,
            interval,
            nextPaymentDate,
            feeCallback
        });
        await recurringPayment.save();
        return recurringPayment;
    }


    async sakshUpdateRecurringPayment(paymentId, updates) {
        const recurringPayment = await RecurringPayment.findById(paymentId);
        if (!recurringPayment) {
            throw new Error('Recurring payment not found');
        }
        Object.assign(recurringPayment, updates);
        await recurringPayment.save();
        return recurringPayment;
    }

    async sakshDeleteRecurringPayment(paymentId) {
        await RecurringPayment.findByIdAndDelete(paymentId);
    }


    sakshCalculateNextPaymentDate(interval) {
        const now = new Date();
        switch (interval) {
            case 'daily':
                return new Date(now.setDate(now.getDate() + 1));
            case 'weekly':
                return new Date(now.setDate(now.getDate() + 7));
            case 'monthly':
                return new Date(now.setMonth(now.getMonth() + 1));
            default:
                throw new Error('Invalid interval');
        }
    }





}

module.exports = {
    Wallet,
    WalletUser
}
