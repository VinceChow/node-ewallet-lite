const router = require('express').Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const checkAmount = require('../middleware/checkAmount');
const checkBalance = require('../middleware/checkBalance');
const Transaction = require('../models/transaction');
const {
    TRANSACTION_TYPE,
    PAYMENT,
    DIRECTION
} = require('../utils/constants/transaction');

router.post('/', auth, checkAmount, checkBalance, async (req, res) => {
    if (!Object.values(PAYMENT).includes(req.body.paymentType)) {
        return res.status(400).send('Invalid payment type!');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const amount = req.body.amount;
        const user = req.user;

        user.$session(session);
        user.balance -= amount;
        await user.save();

        const transaction = await new Transaction({
            user: user._id,
            amount,
            type: TRANSACTION_TYPE.PAYMENT,
            typeDetail: req.body.paymentType,
            direction: DIRECTION.OUT,
            description: req.body.paymentType
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
