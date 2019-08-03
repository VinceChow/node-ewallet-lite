const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
            required: true
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
            default: 0.0
        }
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

// Has the plain text pin before saving
userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('pin')) {
        user.pin = await bcrypt.hash(user.pin, 8);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
