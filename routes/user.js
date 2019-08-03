const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const { updateProfile } = require('../middleware/verifyUpdate');

const router = new express.Router();

router.post('/register', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.contactNumber,
            req.body.pin
        );
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.token = null;
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/profile', auth, async (req, res) => {
    res.send(req.user);
});

router.patch('/profile', auth, updateProfile, async (req, res) => {
    try {
        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
