const mongoose = require('mongoose');
const uniqueString = require('unique-string');
const { MERCHANT_STATUS, SETTLEMENT } = require('../utils/constants/merchant');

const merchantSchema = new mongoose.Schema(
    {
        mid: {
            type: String,
            required: true,
            unique: true,
            immutable: true,
            default: uniqueString()
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
        internalAccountBalance: {
            type: Number,
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
            validate(value) {
                if (!Object.values(SETTLEMENT).includes(value)) {
                    throw new Error('Invalid settlement period');
                }
            }
        },
        status: {
            type: String,
            required: true,
            default: MERCHANT_STATUS.ACTIVE,
            validate(value) {
                if (!Object.values(MERCHANT_STATUS).includes(value)) {
                    throw new Error('Invalid merchant status');
                }
            }
        }
    },
    { timestamps: true }
);

const Merchant = mongoose.model('Merchant', merchantSchema);

module.exports = Merchant;
