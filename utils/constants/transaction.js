const TRANSACTION_TYPE = Object.freeze({
    RELOAD: 'reload',
    PAYMENT: 'payment',
    TRANSFER: 'transfer'
});

const RELOAD = Object.freeze({
    OB: 'online banking',
    CC: 'credit/debit card'
});

const PAYMENT = Object.freeze({
    ONLINE: 'online',
    B2C: 'B2C',
    C2B: 'C2B'
});

const TRANSFER = Object.freeze({
    P2P: 'P2P'
});

const DIRECTION = Object.freeze({
    IN: 'in',
    OUT: 'out'
});

const TRANSACTION_LIMIT = Object.freeze({
    DAILY: 1000,
    MONTHLY: 10000,
    ANNUAL: 50000
});

module.exports = {
    TRANSACTION_TYPE,
    RELOAD,
    PAYMENT,
    TRANSFER,
    DIRECTION,
    TRANSACTION_LIMIT
};
