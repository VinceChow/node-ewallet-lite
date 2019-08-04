const express = require('express');
const validator = require('validator');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/', auth, async (req, res) => {
    const amount = req.body.amount;
    if (!amount) {
        return res.status(400).send('Please specify reload amount!');
    } else if (!validator.isCurrency(amount, { allow_negatives: false })) {
        return res.status(400).send('Invalid amount!');
    }

    try {
        req.user.balance += Number(amount);
        req.user.save();
        res.send('Reload success');
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
