const mongoose = require('mongoose');

const { Wallet, WalletUser } = require('../index');

//const { Wallet, WalletUser } = require(saksh-wallet);



async function main() {


    try {
        var str = "mongodb+srv://susheel2339:iJQcnYKE1jRG591G@susheel2339.wmx2d.mongodb.net/";
        await mongoose.connect(str, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }

    try {
        const user = new WalletUser({
            userId: 'user123',
            balances: new Map(),
            dailyTotal: 0,
            dailyLimit: 1000,
            lastTransactionDate: new Date()
        });

        await user.save();

        console.log('User created:', user);
    } catch (error) {
        console.error('Error:', error);

    }


    try {


        const wallet = new Wallet();


        // Example: Credit a user
        const newBalance = await wallet.credit('user123', 100, 'USD', 'Initial deposit', 'REF123');
        console.log('New Balance:', newBalance);

        // Example: Debit a user
        const updatedBalance = await wallet.debit('user123', 50, 'USD', 'Purchase', 'REF124');
        console.log('Updated Balance:', updatedBalance);

        // Example: Get balance
        const balance = await wallet.getBalance('user123', 'USD');
        console.log('Balance:', balance);

        // Example: Get transaction report
        const transactions = await wallet.getTransactionReport('user123');
        console.log('Transactions:', transactions);



        const transferFee = 5; // Example transfer fee
        const adminId = 'admin_user_id'; // Admin user ID
        wallet.transferFunds(senderId, recipientId, amount, currency, description, referenceNumber, transferFee, adminId)
            .then(result => {
                console.log('Transfer successful:', result);
            })
            .catch(error => {
                console.error('Transfer failed:', error);
            });

        // For no transfer fee
        wallet.transferFunds(senderId, recipientId, amount, currency, description, referenceNumber)
            .then(result => {
                console.log('Transfer successful:', result);
            })
            .catch(error => {
                console.error('Transfer failed:', error);
            });



    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
    }
}

main();
