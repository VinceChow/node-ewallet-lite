const updateProfile = (req, res, next) => {
    const invalidUpdates = ['token'];
    const { isInvalidOperation, updates } = verifyUpdate(req, invalidUpdates);
    if (isInvalidOperation) {
        return res.status(400).send('Invalid updates!');
    } else {
        updates.forEach(update => (req.user[update] = req.body[update]));
    }
    next();
};

function verifyUpdate(req, invalidUpdates) {
    const updates = Object.keys(req.body);
    const isInvalidOperation = updates.some(update =>
        invalidUpdates.includes(update)
    );
    return { isInvalidOperation, updates };
}

module.exports = {
    updateProfile
};
