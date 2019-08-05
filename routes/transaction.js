const express = require('express');
const auth = require('../middleware/auth');
const Transaction = require('../models/transaction');

const router = new express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id });
        res.send(transactions);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
