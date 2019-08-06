const { TRANSACTION_LIMIT } = require('../utils/constants/transaction');
const getLimitDate = require('../utils/limitDate');

const checkLimit = async (req, res, next) => {
    const userLimits = req.user.limits;
    const amount = req.body.amount;

    if (userLimits.length !== 0) {
        for (const limit of userLimits) {
            const key = getLimitDate(limit.limitType);
            if (limit.key !== key) {
                continue;
            }

            const limitValue = TRANSACTION_LIMIT[limit.limitType].VALUE;
            if (limit.value + amount > limitValue) {
                return res
                    .status(400)
                    .send(`Error: Exceeding ${limit.limitType} LIMIT!`);
            }
        }
    }

    next();
};

module.exports = checkLimit;
