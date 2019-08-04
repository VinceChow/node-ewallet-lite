const MERCHANT_STATUS = Object.freeze({
    ACTIVE: 'active',
    DELETE: 'delete',
    SUSPEND: 'suspend'
});

const SETTLEMENT = Object.freeze({
    T_PLUS_1: 't+1',
    T_PLUS_2: 't+2',
    W_PLUS_1: 'w+1',
    B_PLUS_1: 'b+1'
});

module.exports = {
    MERCHANT_STATUS,
    SETTLEMENT
};
