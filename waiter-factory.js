module.exports = function (pool) {
    async function setDays (name, shift) {
        let person = await pool.query('select id from staff where first_name=$1', [name]);
        if (person.rowCount === 0) {
            return `Sorry we do not have ${name} on our records`;
        };
        for (const day of shift) {
            let dayID = await pool.query('select id from weekdays where day_name=$1', [day]);
            await pool.query('insert into shifts (waiter_id, weekday_id) values ($1,$2)', [person.rows[0].id, dayID.rows[0].id]);
        };
        return `Thank you for selecting your shift for the week ${name}`;
    };

    // async function getWeekDays () {
    //     let list = await pool.query('select day_name from weekdays');
    //     return list.rows;
    // };

    async function getShift (name) {
        let person = await pool.query('select id from staff where first_name=$1', [name]);
        let waiter = person.rows[0].id;
        let list = await pool.query('select weekday_id from shifts where waiter_id=$1', [waiter]);
        let days = list.rows;
        let shift = [];
        for (const day of days) {
            let dayName = await pool.query('select day_name from weekdays where id=$1', [day.weekday_id]);
            shift.push(dayName.rows[0].day_name);
        }
        return shift;
    };

    async function waitersWithDay () {
        let list = await pool.query('select day_name from weekdays join shifts on shifts.weekday_id=weekdays.id join staff on staff.id=shifts.waiter_id;');
        let days = list.rows;
        return days;

        // let dayName = [];

        // for (const day of days) {
        //     let list2 = await pool.query('select day_name,first_name  from weekdays join  shifts on  shifts.weekday_id=weekdays.id join staff on staff.id=shifts.waiter_id where day_name=$1',[day]);
        //     console.log('Day And Name');
        //     console.log(list2.rows);
        // }
        // return  dayName;
    };

    async function resetShifts() {
        await pool.query('delete from shifts');
    };

    return {
        schedule: setDays,
        // days: getWeekDays,
        shift: getShift,
        reset: resetShifts,
        dayWaiter: waitersWithDay
    };
};