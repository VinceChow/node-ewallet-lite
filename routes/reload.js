const express = require('express');
const mongoose = require('mongoose');
const validator = require('validator');
const Transaction = require('../models/transaction');
const auth = require('../middleware/auth');
const { TRANSACTION_TYPE, RELOAD } = require('../utils/constants/transaction');

const router = new express.Router();

router.post('/', auth, async (req, res) => {
    const amount = req.body.amount;
    if (!amount) {
        return res.status(400).send('Please specify reload amount!');
    } else if (!validator.isCurrency(amount, { allow_negatives: false })) {
        return res.status(400).send('Invalid amount!');
    }

    if (!Object.values(RELOAD).includes(req.body.reloadMethod)) {
        return res.status(400).send('Invalid reload method!');
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
