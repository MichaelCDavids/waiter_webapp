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
        
      let selectedShift=  await pool.query('select day_name from weekdays join shifts on shifts.weekday_id=weekdays.id join staff on staff.id=shifts.waiter_id where username=$1', [username]);
     
      return selectedShift.rows;

    };

    async function userShift(username) {
        let days = await getWeekDays(); 
        let selectedShifts =await selectedShift(username);
        for (let i = 0; i < days.length; i++) {
            let day = days[i].day_name;
          for (const current of selectedShifts) {
              if (day === current.day_name) {
                days[i].checked = true;
             
              }
          }
        }
        return days
    };

    async function allShifts(){
        let shifts = await pool.query('select first_name,day_name from weekdays join shifts on shifts.weekday_id=weekdays.id join staff on staff.id=shifts.waiter_id');
        console.log(shifts.rows);
        return shifts.rows;
    }

    return {
        days: getWeekDays,
        schedule: setDays,
        shiftSelected: selectedShift,
        userShift,
        allShifts
    };
};
