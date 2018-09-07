module.exports = function (pool) {
    async function setDays () {
        return 'This function should set days a waiter is available';
    };

    async function clearDays () {
        await pool.query('delete * from table3');
    }

    return {
        chooseDays: setDays,
        reset: clearDays
    };
}
;
