# saksh-wallet
 saksh-wallet is a Node.js library for managing user wallets, including functionalities for crediting, debiting, and converting currencies, as well as retrieving balances and transaction reports.

## Features

-   **Credit**   Add funds to a user's wallet.
-   **Debit**   Withdraw funds from a user's wallet.
-   **Convert Currency** : Convert funds from one currency to another.
-   **Get Balance** : Retrieve the balance of a specific currency for a user.
-   **Transaction Report** : Get a report of all transactions for a user.
-   **Reverse Transaction** : Reverse a specific transaction.
-   **Reverse Multiple Transactions** : Reverse multiple transactions in a single operation.



## Installation

Install the package via npm:

```bash
npm install saksh-wallet
```
 

### API
``` credit(userId, amount, currency, description, referenceNumber) ```
- Credits an amount to the user's wallet.

•  Parameters:

- userId (string): The ID of the user.
- amount (number): The amount to credit.
- currency (string): The currency of the amount.
- description (string): Description of the transaction.
- referenceNumber (string): Reference number for the transaction.
- Returns: The new balance of the user in the specified currency.

#### debit(userId, amount, currency, description, referenceNumber)
Debits an amount from the user's wallet.

•  Parameters:

- userId (string): The ID of the user.
- amount (number): The amount to debit.
- currency (string): The currency of the amount.
- description (string): Description of the transaction.
- referenceNumber (string): Reference number for the transaction.
- Returns: The new balance of the user in the specified currency.


#### convertCurrency(userId, fromCurrency, toCurrency, amount)

Converts currency in the user's wallet.

•  Parameters:

- userId (string): The ID of the user.
- fromCurrency (string): The currency to convert from.
- toCurrency (string): The currency to convert to.
- amount (number): The amount to convert.
- Returns: The new balances of the user in both currencies.

#### getBalance(userId, currency)
Gets the balance of the user in a specific currency.

•  Parameters:

- userId (string): The ID of the user.
- currency (string): The currency to get the balance of.
- Returns: The balance of the user in the specified currency.

#### getTransactionReport(userId)
Gets the transaction report of the user.

•  Parameters:

- userId (string): The ID of the user.
- Returns: The list of transactions of the user.

#### reverseTransaction(transactionId, session)
Reverses a transaction.

•  Parameters:
- transactionId (string): The ID of the transaction to reverse.
- session (Object): The mongoose session.

-  Returns: The reversed transaction.

#### reverseMultipleTransactions(transactionIds)
Reverses multiple transactions.

-  Parameters:
- transactionIds (Array<string>): The IDs of the transactions to reverse.
- Returns: The list of reversed transactions.


### example


```
const mongoose = require('mongoose');

//const { Wallet, WalletUser } = require('./index');
const { Wallet, WalletUser } = require(saksh-wallet);

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI );

async function main() {

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
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
    }
}

main();


```
### License
This project is licensed under the MIT License. See the LICENSE file for details.
 
### SUPPORT
susheel2339 @ gmail.com
