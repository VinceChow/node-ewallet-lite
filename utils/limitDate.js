const { TRANSACTION_LIMIT } = require('../utils/constants/transaction');

const getLimitDate = limitType => {
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let limitKey;

    switch (limitType) {
    case TRANSACTION_LIMIT.DAILY.NAME:
        if (isLastDayOfTheMonth(year, month, day)) {
            if (month === 12) {
                year += 1;
                month = 1;
            } else {
                month += 1;
            }
            day = 1;
        } else {
            day += 1;
        }

        limitKey =
                year.toString() +
                (month < 10 ? '0' : '') +
                month.toString() +
                (day < 10 ? '0' : '') +
                day.toString();
        break;
    case TRANSACTION_LIMIT.MONTHLY.NAME:
        if (month === 12) {
            year += 1;
            month = 1;
        } else {
            month += 1;
        }

        limitKey =
                year.toString() +
                (month < 10 ? '0' : '') +
                month.toString() +
                '01';
        break;
    case TRANSACTION_LIMIT.ANNUAL.NAME:
        limitKey = (year + 1).toString() + '0101';
        break;
    }

    return limitKey;
};

function isLastDayOfTheMonth(year, month, day) {
    const lastDay = new Date(year, month, 0).getDate();
    return day === lastDay;
}

module.exports = getLimitDate;
