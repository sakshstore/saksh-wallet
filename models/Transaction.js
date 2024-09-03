
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    type: { type: String, required: true },
    amount: {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                return v > 0;
            },
            message: props => `${props.value} is not a positive number!`
        }
    },
    currency: { type: String, required: true },
    description: { type: String },
    referenceNumber: { type: String },
    date: { type: Date, default: Date.now },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
