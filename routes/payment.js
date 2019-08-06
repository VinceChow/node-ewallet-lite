const router = require('express').Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const checkAmount = require('../middleware/checkAmount');
const checkBalance = require('../middleware/checkBalance');
const checkLimit = require('../middleware/checkLimit');
const Transaction = require('../models/transaction');
const Merchant = require('../models/merchant');
const {
    TRANSACTION_TYPE,
    PAYMENT,
    DIRECTION,
    TRANSACTION_LIMIT
} = require('../utils/constants/transaction');
const getLimitDate = require('../utils/limitDate');

router.post(
    '/',
    auth,
    checkAmount,
    checkBalance,
    checkLimit,
    async (req, res) => {
        const merchant = await validateMid(req.body.mid);
        if (!merchant) {
            return res.status(404).send('Merchant not found!');
        }

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
            user.limits = updateLimit(req.user.limits, amount);
            await user.save();

            merchant.$session(session);
            merchant.internalAccountBalance += amount;
            await merchant.save();

            const transaction = await new Transaction({
                user: user._id,
                amount,
                type: TRANSACTION_TYPE.PAYMENT,
                typeDetail: req.body.paymentType,
                direction: DIRECTION.OUT,
                description: req.body.orderDetail,
                mid: merchant.mid
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
    }
);

async function validateMid(mid) {
    if (!mid) {
        return undefined;
    }
    return await Merchant.findOne({ mid });
}

function updateLimit(userLimits, amount) {
    if (userLimits.length !== 0) {
        userLimits.forEach(limit => {
            const key = getLimitDate(limit.limitType);
            if (limit.key !== key) {
                limit.key = key;
                limit.value = 0;
            }
            limit.value += amount;
        });
    } else {
        Object.keys(TRANSACTION_LIMIT).forEach(key => {
            const limit = {
                limitType: key,
                key: getLimitDate(key),
                value: amount
            };
            userLimits.push(limit);
        });
    }
    return userLimits;
}

module.exports = router;
