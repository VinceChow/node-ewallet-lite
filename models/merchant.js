const mongoose = require('mongoose');
const uniqueString = require('unique-string');
const { MERCHANT_STATUS, SETTLEMENT } = require('../utils/constants/merchant');

const merchantSchema = new mongoose.Schema(
    {
        mid: {
            type: String,
            required: true,
            unique: true,
            immutable: true
        },
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        branch: {
            type: String
        },
        countryCode: {
            type: String,
            required: true,
            default: '+60'
        },
        contactNumber: {
            type: Number,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        internalAccountBalance: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },
        bankName: {
            type: String,
            required: true
        },
        bankAccountNumber: {
            type: Number,
            required: true
        },
        settlementPeriod: {
            type: String,
            required: true,
            default: SETTLEMENT.T_PLUS_1,
            enum: Object.values(SETTLEMENT)
        },
        status: {
            type: String,
            required: true,
            default: MERCHANT_STATUS.ACTIVE,
            enum: Object.values(MERCHANT_STATUS)
        }
    },
    { timestamps: true }
);

merchantSchema.pre('save', async function(next) {
    const merchant = this;
    if (merchant.isNew) {
        merchant.mid = uniqueString();
    }
    next();
});

const Merchant = mongoose.model('Merchant', merchantSchema);

module.exports = Merchant;
