const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { ACCOUNT_STATUS } = require('../utils/constants/user');
const { GLOBAL_MAX } = require('../utils/constants/balance');
const { TRANSACTION_LIMIT } = require('../utils/constants/transaction');

const limitSchema = new mongoose.Schema(
    {
        limitType: {
            type: String,
            required: true,
            unique: true,
            enum: Object.keys(TRANSACTION_LIMIT)
        },
        key: {
            type: String,
            required: true
        },
        value: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        }
    },
    { timestamps: true }
);

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email');
                }
            }
        },
        countryCode: {
            type: String,
            required: true,
            default: '+60'
        },
        contactNumber: {
            type: Number,
            required: true,
            unique: true
        },
        pin: {
            type: String,
            required: true
        },
        token: {
            type: String
        },
        balance: {
            type: Number,
            min: 0,
            max: GLOBAL_MAX,
            default: 0
        },
        status: {
            type: String,
            required: true,
            default: ACCOUNT_STATUS.ACTIVE,
            enum: Object.values(ACCOUNT_STATUS)
        },
        limits: [limitSchema]
    },
    {
        timestamps: true
    }
);

// Remove sensitive information
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.pin;
    delete userObject.token;

    return userObject;
};

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign(
        { _id: user._id.toString() },
        process.env.JWT_SECRET
    );

    user.token = token;
    await user.save();

    return token;
};

userSchema.statics.findByCredentials = async (contactNumber, pin) => {
    const user = await User.findOne({ contactNumber });
    if (!user) {
        throw new Error('Unable to login!');
    }
    const isMatch = await bcrypt.compare(pin, user.pin);
    if (!isMatch) {
        throw new Error('Unable to login!');
    }
    return user;
};

// Has the plain text pin before saving
userSchema.pre('save', async function(next) {
    const user = this;

    // // Testing Only
    // console.log(user.isNew);
    // console.log('name isModified', user.isModified('name'));
    // console.log('modifiedPaths', user.modifiedPaths());

    if (user.isModified('pin')) {
        user.pin = await bcrypt.hash(user.pin, 8);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
