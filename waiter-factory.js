module.exports = function (pool) {
    async function getWeekDays () {
        let list = await pool.query('select day_name from weekdays');
        return list.rows;
    };
    async function setDays (username, shift) {
        let person = await pool.query('select id from staff where username=$1', [username]);
        if (person.rowCount === 0) {
            await pool.query('insert into staff (username) values ($1)', [username]);
            person = await pool.query('select id from staff where username=$1', [username]);
        };

        await pool.query('delete from shifts where waiter_id=$1', [person.rows[0].id]);
        for (const day of shift) {
            let dayID = await pool.query('select id from weekdays where day_name=$1', [day]);
            await pool.query('insert into shifts (waiter_id, weekday_id) values ($1,$2)', [person.rows[0].id, dayID.rows[0].id]);
        };
        return `Thank you for selecting your shift for the week ${username}`;
    };
    async function selectedShift (username) {
        let found = await pool.query('select username from staff where username=$1', [username]);
        if (found.rowCount === 0) {
            return `can not find username for ${username}`;
        }
        let selectedShift = await pool.query('select day_name from weekdays join shifts on shifts.weekday_id=weekdays.id join staff on staff.id=shifts.waiter_id where username=$1', [username]);
        return selectedShift.rows;
    };
    async function userShift (username) {
        let days = await getWeekDays();
        let selectedShifts = await selectedShift(username);
        for (let i = 0; i < days.length; i++) {
            let day = days[i].day_name;
            for (const current of selectedShifts) {
                if (day === current.day_name) {
                    days[i].checked = true;
                }
            }
        }
        return days;
    };
    async function allShifts () {
        let days = await getWeekDays();
        let allShifts = await pool.query('select username,day_name from weekdays join shifts on shifts.weekday_id=weekdays.id join staff on staff.id=shifts.waiter_id');
        let shifts = allShifts.rows;
        let dayAndNames = [];
        for (let day of days) {
            let output = {};
            shifts.map(shift => {
                let today = day.day_name;
                if (output[today] === undefined) {
                    output[today] = [];
                }
                if (today === shift.day_name) {
                    output[today].push(shift.username);
                }
            });
            dayAndNames.push(output);
        }
        return dayAndNames;
    };
    async function shiftsObject () {
        let shifts = await allShifts();
        let shiftData = [];
        shifts.map(shift => {
            const [dayName, waiters] = Object.entries(shift)[0];
            let shiftForDay = shiftData.find(currentShift => {
                return dayName === currentShift.day_name;
            });
            if (shiftForDay) {
                shiftForDay.waiters = waiters;
            } else {
                shiftData.push({ weekday: dayName, waiters: waiters });
            }
        });
        return shiftData;
    }
    async function reset () {
        await pool.query('delete from shifts;');
        return `All Shifts has been cleared`;
    }

    async function status () {
        let shiftData = await shiftsObject();
        shiftData.forEach(day => {
            if (day.waiters.length < 3) {
                day.status = 'red';
            } else if (day.waiters.length == 3) {
                day.status = 'green';
            } else if (day.waiters.length > 3) {
                day.status = 'blue';
            }
        });
        return shiftData;
    }
    return {
        days: getWeekDays,
        schedule: setDays,
        shiftSelected: selectedShift,
        shiftForUser: userShift,
        dayOrder: shiftsObject,
        resetShifts: reset,
        shiftStatus: status
    };
};
