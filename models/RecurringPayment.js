const mongoose = require('mongoose');

const RecurringPaymentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    toUserId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    description: { type: String, required: true },
    referenceNumber: { type: String, required: true },
    interval: { type: String, required: true }, // e.g., 'daily', 'weekly', 'monthly'
    nextPaymentDate: { type: Date, required: true },
    feeCallback: { type: String, required: false }
});

module.exports = mongoose.model('RecurringPayment', RecurringPaymentSchema);