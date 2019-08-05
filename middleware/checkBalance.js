const checkBalance = (req, res, next) => {
    if (req.user.balance - req.body.amount < 0) {
        return res.status(401).send('Insufficient balance!');
    }
    next();
};

module.exports = checkBalance;
