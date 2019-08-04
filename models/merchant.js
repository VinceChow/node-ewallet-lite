const mongoose = require('mongoose');
const uniqueString = require('unique-string');
const { MERCHANT_STATUS } = require('../utils/constants/merchant');

const merchantSchema = new mongoose.Schema(
    {
        mid: {
            type: String,
            required: true,
            unique: true,
            default: uniqueString()
        },
        name: {
            type: String,
            required: true,
            trim: true
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
        accountBalance: {
            type: Number,
            min: 0,
            default: 0
        },
        settlementPeriod: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true,
            default: MERCHANT_STATUS.ACTIVE
        }
    },
    { timestamps: true }
);

const Merchant = mongoose.model('Merchant', merchantSchema);

module.exports = Merchant;
