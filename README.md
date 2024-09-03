# saksh-wallet
 saksh-wallet is a Node.js library for managing user wallets, including functionalities for crediting, debiting, and converting currencies, as well as retrieving balances and transaction reports.

## Features

•   **Credit**   Add funds to a user's wallet.

•   **Debit**   Withdraw funds from a user's wallet.

•   **Convert Currency** : Convert funds from one currency to another.

•   **Get Balance** : Retrieve the balance of a specific currency for a user.

•   **Transaction Report** : Get a report of all transactions for a user.

•   **Reverse Transaction** : Reverse a specific transaction.

•   **Reverse Multiple Transactions** : Reverse multiple transactions in a single operation.



## Installation

Install the package via npm:

```bash
npm install saksh-wallet
```
 

### API
#### credit(userId, amount, currency, description, referenceNumber)
Credits an amount to the user's wallet.

•  Parameters:

•  userId (string): The ID of the user.

•  amount (number): The amount to credit.

•  currency (string): The currency of the amount.

•  description (string): Description of the transaction.

•  referenceNumber (string): Reference number for the transaction.

•  Returns: The new balance of the user in the specified currency.

#### debit(userId, amount, currency, description, referenceNumber)
Debits an amount from the user's wallet.

•  Parameters:

•  userId (string): The ID of the user.

•  amount (number): The amount to debit.

•  currency (string): The currency of the amount.

•  description (string): Description of the transaction.

•  referenceNumber (string): Reference number for the transaction.

•  Returns: The new balance of the user in the specified currency.


#### convertCurrency(userId, fromCurrency, toCurrency, amount)

Converts currency in the user's wallet.

•  Parameters:

•  userId (string): The ID of the user.

•  fromCurrency (string): The currency to convert from.

•  toCurrency (string): The currency to convert to.

•  amount (number): The amount to convert.

•  Returns: The new balances of the user in both currencies.

#### getBalance(userId, currency)
Gets the balance of the user in a specific currency.

•  Parameters:

•  userId (string): The ID of the user.

•  currency (string): The currency to get the balance of.

•  Returns: The balance of the user in the specified currency.

#### getTransactionReport(userId)
Gets the transaction report of the user.

•  Parameters:

•  userId (string): The ID of the user.

•  Returns: The list of transactions of the user.

#### reverseTransaction(transactionId, session)
Reverses a transaction.

•  Parameters:
•  transactionId (string): The ID of the transaction to reverse.

•  session (Object): The mongoose session.

•  Returns: The reversed transaction.

#### reverseMultipleTransactions(transactionIds)
Reverses multiple transactions.

•  Parameters:

•  transactionIds (Array<string>): The IDs of the transactions to reverse.

•  Returns: The list of reversed transactions.





### Running the Scheduler
To run the recurring payments scheduler, use the following command:

``` npm run run-scheduler ```


The Saksh Wallet provides several functions for managing recurring payments and fund transfers. Here’s a summary of each function along with its parameters, return values, and examples:

### 1. **sakshCreateRecurringPayment**
- **Description**: Creates a new recurring payment.
- **Parameters**:
  - `userId` (String): The ID of the user making the payment.
  - `toUserId` (String): The ID of the user receiving the payment.
  - `amount` (Number): The amount to be transferred.
  - `currency` (String): The currency of the transaction.
  - `description` (String): A description of the payment.
  - `referenceNumber` (String): A reference number for the transaction.
  - `interval` (String): The interval for the recurring payment (daily, weekly, monthly).
  - `feeCallback` (Function, optional): A custom callback function to calculate the fee.
- **Returns**: The created recurring payment object.
- **Example**:
  ```javascript
  const recurringPayment = await wallet.sakshCreateRecurringPayment(
    'user1',
    'user2',
    100,
    'USD',
    'Monthly subscription',
    'REF12345',
    'monthly'
  );
  ```

### 2. **sakshUpdateRecurringPayment**
- **Description**: Updates an existing recurring payment.
- **Parameters**:
  - `paymentId` (String): The ID of the recurring payment to update.
  - `updates` (Object): An object containing the updates.
- **Returns**: The updated recurring payment object.
- **Example**:
  ```javascript
  const updatedPayment = await wallet.sakshUpdateRecurringPayment('paymentId123', { amount: 150 });
  ```

### 3. **sakshDeleteRecurringPayment**
- **Description**: Deletes an existing recurring payment.
- **Parameters**:
  - `paymentId` (String): The ID of the recurring payment to delete.
- **Returns**: None.
- **Example**:
  ```javascript
  await wallet.sakshDeleteRecurringPayment('paymentId123');
  ```

### 4. **sakshCalculateNextPaymentDate**
- **Description**: Calculates the next payment date based on the interval.
- **Parameters**:
  - `interval` (String): The interval for the recurring payment (daily, weekly, monthly).
- **Returns**: The next payment date (Date).
- **Example**:
  ```javascript
  const nextPaymentDate = wallet.sakshCalculateNextPaymentDate('monthly');
  ```

### 5. **sakshTransferFunds**
- **Description**: Transfers funds from one user to another, including a fee.
- **Parameters**:
  - `fromUserId` (String): The ID of the user sending the funds.
  - `toUserId` (String): The ID of the user receiving the funds.
  - `amount` (Number): The amount to be transferred.
  - `currency` (String): The currency of the transaction.
  - `description` (String): A description of the transaction.
  - `referenceNumber` (String): A reference number for the transaction.
  - `customFeeCallback` (Function, optional): A custom callback function to calculate the fee.
- **Returns**: An object containing the details of the transfer.
- **Example**:
  ```javascript
  const transferResult = await wallet.sakshTransferFunds(
    'user1',
    'user2',
    200,
    'USD',
    'Payment for services',
    'REF12345',
    (amount) => amount <= 100 ? 1.0 : (amount * 1.5) / 100
  );
  ```

### 6. **sakshCalculateFee**
- **Description**: Calculates the fee for a transaction.
- **Parameters**:
  - `amount` (Number): The amount of the transaction.
  - `customFeeCallback` (Function, optional): A custom callback function to calculate the fee.
- **Returns**: The calculated fee (Number).
- **Example**:
  ```javascript
  const fee = wallet.sakshCalculateFee(200, (amount) => amount <= 100 ? 1.0 : (amount * 1.5) / 100);
  ```

These functions provide a comprehensive set of tools for managing payments and fees within the Saksh Wallet system.




### example


```
const mongoose = require('mongoose');

//const { Wallet, WalletUser } = require('./index');
const { Wallet, WalletUser } = require(saksh-wallet);

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

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



        



        wallet.transferFunds('user1', 'user2', 200, 'USD', 'Payment for services', 'REF12345', customFeeCallback)
            .then(result => console.log('Transfer successful:', result))
            .catch(error => console.error('Transfer failed:', error));





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