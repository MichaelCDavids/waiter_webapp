module.exports = function (pool) {
    async function setDays (name,shift) {
        let person = await pool.query('select id from staff where name=$1',[name]);
        if(person.rowCount===0){
            
        }
    };
    async function getShift () {
        await pool.query('');
    };
    async function updateDays () {
        await pool.query('');
    };

    async function clearDays () {
        await pool.query('');
    };

    return {
        shifts: getShift,
        schedule: setDays,
        update: updateDays,
        reset: clearDays
    };
}
;
