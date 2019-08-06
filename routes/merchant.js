const express = require('express');
const Merchant = require('../models/merchant');
const { MERCHANT_STATUS } = require('../utils/constants/merchant');

const router = new express.Router();

router.post('/register', async (req, res) => {
    const merchant = new Merchant(req.body);
    try {
        await merchant.save();
        res.status(201).send(merchant);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/:mid', async (req, res) => {
    const merchant = await Merchant.findOne({ mid: req.params.mid });
    if (!merchant) {
        res.status(404).send('Merchant does not exist!');
    } else {
        res.send(merchant);
    }
});

router.patch('/update', async (req, res) => {
    const merchant = await Merchant.findOne({ mid: req.body.mid });
    if (!merchant) {
        return res.status(404).send('Merchant does not exist!');
    }
    delete req.body.mid;

    const validUpdates = [
        'name',
        'branch',
        'countryCode',
        'contactNumber',
        'settlementPeriod'
    ];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update =>
        validUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send('Invalid updates!');
    }

    try {
        updates.forEach(update => (merchant[update] = req.body[update]));
        await merchant.save();
        res.send(merchant);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/delete', async (req, res) => {
    const merchant = await Merchant.findOne({ mid: req.body.mid });
    if (!merchant) {
        return res.status(404).send('Merchant does not exist!');
    }

    try {
        merchant.status = MERCHANT_STATUS.DELETE;
        await merchant.save();
        res.send('Merchant has been deleted.');
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/activate', async (req, res) => {
    const merchant = await Merchant.findOne({ mid: req.body.mid });
    if (!merchant) {
        return res.status(404).send('Merchant does not exist!');
    }

    try {
        merchant.status = MERCHANT_STATUS.ACTIVE;
        await merchant.save();
        res.send('Merchant has been activated.');
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
