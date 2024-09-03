const mongoose = require('mongoose');

const { Wallet, WalletUser } = require('./index');

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


        const wallet = new Wallet();


        // Example: Credit a user
        const newBalance = await wallet.credit('user1234', 100, 'USD', 'Initial deposit', 'REF123');
        console.log('New Balance:', newBalance);

        // Example: Debit a user
        const updatedBalance = await wallet.debit('user1234', 50, 'USD', 'Purchase', 'REF124');
        console.log('Updated Balance:', updatedBalance);

        // Example: Get balance
        const balance = await wallet.getBalance('user1234', 'USD');
        console.log('Balance:', balance);

        // Example: Get transaction report
        const transactions = await wallet.getTransactionReport('user1234');
        console.log('Transactions:', transactions);



        const transferFee = 5; // Example transfer fee
        const adminId = 'admin_user_id'; // Admin user ID

        senderId = 'user1234';
        recipientId = 'user4565';
        amount = 50;

        currency = 'USD';
        description = 'Transfer';
        referenceNumber = 'REF125';


        const customFeeCallback = (amount) => {
            // Custom fee calculation logic
            if (amount <= 100) {
                return 1.0; // Fixed fee for amounts <= 100
            } else {
                return (amount * 1.5) / 100; // Percentage fee for amounts > 100
            }
        };




        wallet.transferFunds('user12', 'user23', 200, 'USD', 'Payment for services', 'REF12345', customFeeCallback)
            .then(result => console.log('Transfer successful:', result))
            .catch(error => console.error('Transfer failed:', error));




        /*
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
        */


    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
    }
}



main();
