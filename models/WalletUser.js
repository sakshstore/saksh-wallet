
const mongoose = require('mongoose');

const walletUserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    balances: { type: Map, of: Number, default: {} },
    dailyLimit: { type: Number, default: 1000 }, // Example daily limit
    dailyTotal: { type: Number, default: 0 },
    lastTransactionDate: { type: Date, default: Date.now },
}, { versionKey: 'version' });

const WalletUser = mongoose.model('WalletUser', walletUserSchema);

module.exports = WalletUser;