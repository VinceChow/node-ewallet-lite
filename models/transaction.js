const mongoose = require('mongoose');
const uniqueString = require('unique-string');
// const { TRANSACTION_TYPE, RELOAD, PAYMENT, TRANSFER } = require('../utils/constants/transaction');

const transactionSchema = new mongoose.Schema(
    {
        transactionId: {
            type: String,
            required: true,
            unique: true,
            immutable: true,
            default: uniqueString()
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        amount: {
            type: Number,
            required: true,
            min: 0.1
        },
        type: {
            type: String,
            required: true
        },
        typeDetail: {
            type: String,
            required: true
        },
        description: {
            type: String
        }
    },
    { timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
