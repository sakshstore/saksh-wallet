# saksh-wallet
 saksh-wallet is a Node.js library for managing user wallets, including functionalities for crediting, debiting, and converting currencies, as well as retrieving balances and transaction reports.

## Features

•   **Credit**   Add funds to a user's wallet.

•   **Debit**   Withdraw funds from a user's wallet.
 
•   **Get Balance** : Retrieve the balance of a specific currency for a user.

•   **Transaction Report** : Get a report of all transactions for a user.

•   **Reverse Transaction** : Reverse a specific transaction.

•   **Reverse Multiple Transactions** : Reverse multiple transactions in a single operation.



## Installation

Install the package via npm:

```bash
npm install saksh-wallet
```
 
 



 Here's the updated `README.md` file with the package name set to `saksh-wallet` and the license specified as MIT:

```markdown
# Saksh Wallet Management System

A simple wallet management system built with Node.js and MongoDB. This package provides functionalities for managing user wallets, transactions, and recurring payments.

## Features

- Create and manage user wallets
- Credit and debit transactions
- Transfer funds between users
- Set daily transaction limits
- Generate transaction reports
- Support for recurring payments

## Installation

To install the package, run:

```bash
npm install saksh-wallet
```

## Usage

First, require the package and set up your MongoDB connection:

```javascript
const mongoose = require('mongoose');
const { Wallet } = require('saksh-wallet');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your-database', { useNewUrlParser: true, useUnifiedTopology: true });

// Create an instance of the Wallet class
const wallet = new Wallet();
```

### API Methods

#### 1. `sakshSetAdmin(adminUserId)`

Sets the admin user ID.

```javascript
await wallet.sakshSetAdmin('newAdminUserId');
```

#### 2. `sakshSetLimit(nolimit)`

Sets whether the daily limit is applied.

```javascript
await wallet.sakshSetLimit(true); // No limit
```

#### 3. `sakshUpdateBalance(userId, amount, currency, type, description, referenceNumber)`

Updates the balance of a user. The `type` can be either `'credit'` or `'debit'`.

```javascript
await wallet.sakshUpdateBalance('userId', 100, 'USD', 'credit', 'Deposit', 'REF123');
```

#### 4. `sakshTransferFunds(fromUserId, toUserId, amount, currency, description, referenceNumber, customFeeCallback)`

Transfers funds from one user to another.

```javascript
await wallet.sakshTransferFunds('userId1', 'userId2', 50, 'USD', 'Payment for services', 'REF456');
```

#### 5. `sakshGetBalance(userId, currency)`

Gets the balance of a user in a specific currency.

```javascript
const balance = await wallet.sakshGetBalance('userId', 'USD');
console.log(balance);
```

#### 6. `sakshGetTransactionReport(userId)`

Retrieves all transactions for a user.

```javascript
const transactions = await wallet.sakshGetTransactionReport('userId');
console.log(transactions);
```

#### 7. `sakshCreateRecurringPayment(userId, toUserId, amount, currency, description, referenceNumber, interval, feeCallback)`

Creates a recurring payment.

```javascript
await wallet.sakshCreateRecurringPayment('userId', 'toUserId', 20, 'USD', 'Monthly Subscription', 'REF789', 'monthly');
```

#### 8. `sakshReverseTransaction(transactionId)`

Reverses a transaction by its ID.

```javascript
await wallet.sakshReverseTransaction('transactionId');
```

## Events

The `Wallet` class emits the following events:

- `transaction`: Emitted when a transaction occurs.
- `transfer`: Emitted when funds are transferred between users.





Here's a complete `example.js` file that demonstrates how to use the `Wallet` class from the `saksh-wallet` package. This example includes setting up the MongoDB connection, creating users, performing transactions, and generating reports.

```javascript
// example.js

const mongoose = require('mongoose');
const { Wallet } = require('saksh-wallet');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/saksh_wallet', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// Create an instance of the Wallet class
const wallet = new Wallet();

// Example usage
async function runExample() {
    try {
        // Set admin user ID
        await wallet.sakshSetAdmin('adminUserId');

        // Create users
        const userId1 = 'user1';
        const userId2 = 'user2';

        // Credit user1
        await wallet.sakshCredit(userId1, 100, 'USD', 'Initial deposit', 'REF001');
        console.log(`User ${userId1} credited with 100 USD`);

        // Debit user1
        await wallet.sakshDebit(userId1, 30, 'USD', 'Purchase', 'REF002');
        console.log(`User ${userId1} debited 30 USD`);

        // Transfer funds from user1 to user2
        await wallet.sakshTransferFunds(userId1, userId2, 50, 'USD', 'Payment for services', 'REF003');
        console.log(`Transferred 50 USD from ${userId1} to ${userId2}`);

        // Get balance for user1 and user2
        const balanceUser1 = await wallet.sakshGetBalance(userId1, 'USD');
        const balanceUser2 = await wallet.sakshGetBalance(userId2, 'USD');
        console.log(`Balance for ${userId1}: ${balanceUser1} USD`);
        console.log(`Balance for ${userId2}: ${balanceUser2} USD`);

        // Get transaction report for user1
        const transactionsUser1 = await wallet.sakshGetTransactionReport(userId1);
        console.log(`Transactions for ${userId1}:`, transactionsUser1);

        // Create a recurring payment
        const recurringPayment = await wallet.sakshCreateRecurringPayment(userId1, userId2, 10, 'USD', 'Weekly Subscription', 'REF004', 'weekly');
        console.log(`Created recurring payment:`, recurringPayment);

        // Reverse a transaction (example with the first transaction ID)
        if (transactionsUser1.length > 0) {
            const transactionId = transactionsUser1[0]._id;
            await wallet.sakshReverseTransaction(transactionId);
            console.log(`Reversed transaction with ID: ${transactionId}`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close the MongoDB connection
        mongoose.connection.close();
    }
}

// Run the example
runExample();
```

### Explanation of the Example:

1. **MongoDB Connection**: The script connects to a MongoDB database named `saksh_wallet`. Make sure to have MongoDB running and accessible.

2. **Creating an Instance**: An instance of the `Wallet` class is created.

3. **Setting Admin User**: The admin user ID is set.

4. **User Operations**:
   - Two users (`user1` and `user2`) are created.
   - `user1` is credited with an initial deposit of 100 USD.
   - A debit transaction of 30 USD is performed on `user1`.
   - A transfer of 50 USD is made from `user1` to `user2`.

5. **Balance Check**: The balances of both users are retrieved and logged.

6. **Transaction Report**: A transaction report for `user1` is generated and logged.

7. **Recurring Payment**: A recurring payment is created from `user1` to `user2`.

8. **Transaction Reversal**: The script attempts to reverse the first transaction in `user1`'s transaction report.

9. **Error Handling**: Errors are caught and logged.

10. **Closing Connection**: The MongoDB connection is closed at the end of the script.

### Usage
To run the example, save the code in a file named `example.js` and execute it using Node.js:

```bash
node example.js
```

Make sure to have the `saksh-wallet` package installed and MongoDB running before executing the example. Adjust the MongoDB connection string as necessary for your environment.




## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

   
### SUPPORT
susheel2339 @ gmail.com
