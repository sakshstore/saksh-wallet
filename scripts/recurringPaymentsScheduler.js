const cron = require('node-cron');
const RecurringPayment = require('./models/RecurringPayment');

cron.schedule('* * * * *', async () => {
    const now = new Date();
    const duePayments = await RecurringPayment.find({ nextPaymentDate: { $lte: now } });

    for (const payment of duePayments) {
        try {
            const wallet = new Wallet(WalletUser, defaultConfig);
            await wallet.transferFunds(
                payment.userId,
                payment.toUserId,
                payment.amount,
                payment.currency,
                payment.description,
                payment.referenceNumber,
                payment.feeCallback
            );

            // Update next payment date
            payment.nextPaymentDate = wallet.calculateNextPaymentDate(payment.interval);
            await payment.save();
        } catch (error) {
            console.error(`Failed to process recurring payment: ${error.message}`);
        }
    }
});