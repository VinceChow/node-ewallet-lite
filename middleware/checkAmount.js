const validator = require('validator');

const checkAmount = (req, res, next) => {
    const amount = req.body.amount;

    if (!amount) {
        return res.status(400).send('Please specify amount!');
    } else if (!validator.isCurrency(amount, { allow_negatives: false })) {
        return res.status(400).send('Invalid amount!');
    }

    req.body.amount = Number(req.body.amount);
    next();
};

module.exports = checkAmount;
