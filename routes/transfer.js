const router = require('express').Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const checkAmount = require('../middleware/checkAmount');
const checkBalance = require('../middleware/checkBalance');
const User = require('../models/user');
const Transaction = require('../models/transaction');
const {
    TRANSACTION_TYPE,
    TRANSFER,
    DIRECTION
} = require('../utils/constants/transaction');

router.post('/', auth, checkAmount, checkBalance, async (req, res) => {
    const receiver = await User.findOne({ contactNumber: req.body.receiver });
    if (!receiver) {
        return res.status(404).send('Receiver not found!');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const sender = req.user;
        const amount = req.body.amount;

        sender.$session(session);
        receiver.$session(session);

        sender.balance -= amount;
        receiver.balance += amount;

        await sender.save();
        await receiver.save();

        const uniqueString = require('unique-string');

        const transferFrom = await new Transaction({
            transactionId: uniqueString(),
            user: sender._id,
            amount,
            type: TRANSACTION_TYPE.TRANSFER,
            typeDetail: TRANSFER.P2P,
            direction: DIRECTION.OUT,
            description: `Transferred RM${amount} to ${receiver.name} (${
                receiver.countryCode
            }${receiver.contactNumber})`
        }).save({ session });

        const transferTo = await new Transaction({
            transactionId: uniqueString(),
            user: receiver._id,
            amount,
            type: TRANSACTION_TYPE.TRANSFER,
            typeDetail: TRANSFER.P2P,
            direction: DIRECTION.IN,
            description: `Received RM${amount} from ${sender.name} (${
                sender.countryCode
            }${sender.contactNumber})`
        }).save({ session });

        await session.commitTransaction();
        res.send({ transferFrom, transferTo });
    } catch (err) {
        await session.abortTransaction();
        console.log(err);
        res.status(400).send(err.message);
    } finally {
        session.endSession();
    }
});

module.exports = router;
