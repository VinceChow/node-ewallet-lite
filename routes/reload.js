const express = require('express');
const mongoose = require('mongoose');
const validator = require('validator');
const User = require('../models/user');
const Transaction = require('../models/transaction');
const auth = require('../middleware/auth');
const {
    TRANSACTION_TYPE,
    RELOAD,
    PAYMENT,
    TRANSFER
} = require('../utils/constants/transaction');

const router = new express.Router();

router.post('/', auth, async (req, res) => {
    const amount = req.body.amount;
    if (!amount) {
        return res.status(400).send('Please specify reload amount!');
    } else if (!validator.isCurrency(amount, { allow_negatives: false })) {
        return res.status(400).send('Invalid amount!');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = req.user;
        user.$session(session);

        user.balance += Number(amount);
        await user.save();

        const transaction = await new Transaction({
            user: user._id,
            amount,
            type: TRANSACTION_TYPE.RELOAD,
            typeDetail: RELOAD.CC,
            description: 'Credit/debit card reload.'
        }).save({ session });

        await session.commitTransaction();
        res.send(transaction);
    } catch (err) {
        await session.abortTransaction();
        console.log(err);
        res.status(400).send(err.message);
    } finally {
        session.endSession();
    }
});

module.exports = router;
