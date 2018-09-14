module.exports = function (pool) {
    async function getWeekDays () {
        let list = await pool.query('select day_name from weekdays');
        return list.rows;
    };

    async function setDays (username, shift) {
        let person = await pool.query('select id from staff where username=$1', [username]);
        if (person.rowCount === 0) {
            return `Sorry we do not have ${username} on our records`;
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
        let allShifts = await pool.query('select first_name,day_name from weekdays join shifts on shifts.weekday_id=weekdays.id join staff on staff.id=shifts.waiter_id');
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
                    output[today].push(shift.first_name);
                }
            });

            dayAndNames.push(output);
        }

        // for (let i = 0; i < days.length; i++) {
        //     for (let k = 0; k < shifts.length; k++) {
        //         if (days[i].day_name === shifts[k].day_name) {
        //             let obj ={
        //                 day_name : shifts[k].first_name
        //             }
        //             dayAndNames.push(obj);
        //         }
        //     }
        // // }
        // console.log('allShifts: ', dayAndNames);
        
        return dayAndNames;
    };

    async function orderByDay () {
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
                shiftData.push({
                    weekday: dayName,
                    waiters: waiters
                });
            }
        });

        console.log('shiftData: ', shiftData);
        return shiftData;
    }

    return {
        days: getWeekDays,
        schedule: setDays,
        shiftSelected: selectedShift,
        userShift,
        orderByDay
    };
};
