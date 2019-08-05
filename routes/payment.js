const router = require('express').Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const checkAmount = require('../middleware/checkAmount');
const checkBalance = require('../middleware/checkBalance');
const checkLimit = require('../middleware/checkLimit');
const Transaction = require('../models/transaction');
const {
    TRANSACTION_TYPE,
    PAYMENT,
    DIRECTION,
    TRANSACTION_LIMIT
} = require('../utils/constants/transaction');

router.post(
    '/',
    auth,
    checkAmount,
    checkBalance,
    checkLimit,
    async (req, res) => {
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
    }
);

function updateLimit(userLimits, amount) {
    if (userLimits.length !== 0) {
        userLimits.forEach(limit => (limit.value += amount));
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

function getLimitDate(limitType) {
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let limitKey;

    switch (limitType) {
    case TRANSACTION_LIMIT.DAILY:
        if (isLastDayOfTheMonth(year, month, day)) {
            if (month === 12) {
                year += 1;
                month = 1;
            } else {
                month += 1;
            }
            day = 1;
        } else {
            day += 1;
        }

        limitKey =
                year.toString() +
                (month < 10 ? '0' : '') +
                month.toString() +
                (day < 10 ? '0' : '') +
                day.toString();
        break;
    case TRANSACTION_LIMIT.MONTHLY:
        if (month === 12) {
            year += 1;
            month = 1;
        } else {
            month += 1;
        }

        limitKey =
                year.toString() +
                (month < 10 ? '0' : '') +
                month.toString() +
                '01';
        break;
    case TRANSACTION_LIMIT.ANNUAL:
        limitKey = (year + 1).toString() + '0101';
        break;
    }

    return limitKey;
}

function isLastDayOfTheMonth(year, month, day) {
    const lastDay = new Date(year, month, 0).getDate();
    return day === lastDay;
}

module.exports = router;
