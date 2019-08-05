const express = require('express');
const mongoose = require('mongoose');
const Transaction = require('../models/transaction');
const auth = require('../middleware/auth');
const checkAmount = require('../middleware/checkAmount');
const {
    TRANSACTION_TYPE,
    RELOAD,
    DIRECTION
} = require('../utils/constants/transaction');

const router = new express.Router();

router.post('/', auth, checkAmount, async (req, res) => {
    if (!Object.values(RELOAD).includes(req.body.reloadMethod)) {
        return res.status(400).send('Invalid reload method!');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const amount = req.body.amount;
        const user = req.user;

        user.$session(session);
        user.balance += amount;
        await user.save();

        const transaction = await new Transaction({
            user: user._id,
            amount,
            type: TRANSACTION_TYPE.RELOAD,
            typeDetail: req.body.reloadMethod,
            direction: DIRECTION.IN,
            description: req.body.reloadMethod
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
