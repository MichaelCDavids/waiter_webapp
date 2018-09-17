'use strict';
const assert = require('assert');
const WaiterFactory = require('../waiter-factory');
const pg = require('pg');
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/waiter_availability_test';
const pool = new Pool({
    connectionString
});
describe('The Waiter Availability Webapp Functions', function () {
    beforeEach(async function () {
        await pool.query('delete from shifts');
    });
    it('the getWeekDays function should retrieve weekdays from the database', async function () {
        let waiterFactoryObject = WaiterFactory(pool);
        let days = await waiterFactoryObject.days();
        assert.deepEqual(days, [{
            'day_name': 'Sunday'
        }, {
            'day_name': 'Monday'
        }, {
            'day_name': 'Tuesday'
        }, {
            'day_name': 'Wednesday'
        }, {
            'day_name': 'Thursday'
        }, {
            'day_name': 'Friday'
        }, {
            'day_name': 'Saturday'
        }]);
    });
    it('the setDays function should be able to set a shift for a waiter and return a message saying that shift has been captured', async function () {
        let waiterFactoryObject = WaiterFactory(pool);
        let variable = await waiterFactoryObject.schedule('Mike', ['Wednesday', 'Friday', 'Sunday']);
        assert.deepEqual(variable, `Thank you for selecting your shift for the week Mike`);
    });
    it('the selectedShift function should return a list of objects with the shift for one user', async function () {
        let waiterFactoryObject = WaiterFactory(pool);
        let variable = await waiterFactoryObject.shiftSelected('Mike');
        assert.deepEqual(variable, []);
    });
    it('the selectedShift function should return a list of objects with the shift for one user', async function () {
        let waiterFactoryObject = WaiterFactory(pool);
        await waiterFactoryObject.schedule('Mike', ['Wednesday', 'Friday', 'Sunday']);
        let variable = await waiterFactoryObject.shiftSelected('Mike');
        assert.deepEqual(variable, [{
            day_name: 'Wednesday'
        },
        {
            day_name: 'Friday'
        },
        {
            day_name: 'Sunday'
        }
        ]);
    });
    it('the userShift function should mark the selected days of the shift for the week as checked', async function () {
        let waiterFactoryObject = WaiterFactory(pool);
        await waiterFactoryObject.schedule('Mike', ['Wednesday', 'Friday', 'Sunday']);
        let variable = await waiterFactoryObject.shiftForUser('Mike');
        assert.deepEqual(variable, [{
            day_name: 'Sunday',
            checked: true
        },
        {
            day_name: 'Monday'
        },
        {
            day_name: 'Tuesday'
        },
        {
            day_name: 'Wednesday',
            checked: true
        },
        {
            day_name: 'Thursday'
        },
        {
            day_name: 'Friday',
            checked: true
        },
        {
            day_name: 'Saturday'
        }
        ]);
    });
    it('the orderByDay function should order all shifts by day and make them key value pairs for easier use with handlebars', async function () {
        let waiterFactoryObject = WaiterFactory(pool);
        await waiterFactoryObject.schedule('Mike', ['Wednesday', 'Friday', 'Sunday']);
        let variable = await waiterFactoryObject.dayOrder('Mike');
        assert.deepEqual(variable, [{
            weekday: 'Sunday',
            waiters: ['Mike']
        },
        {
            weekday: 'Monday',
            waiters: []
        },
        {
            weekday: 'Tuesday',
            waiters: []
        },
        {
            weekday: 'Wednesday',
            waiters: ['Mike']
        },
        {
            weekday: 'Thursday',
            waiters: []
        },
        {
            weekday: 'Friday',
            waiters: ['Mike']
        },
        {
            weekday: 'Saturday',
            waiters: []
        }
        ]);
    });
    it('the shiftStatus function should return a list of all shifts with status property added to each object in the list', async function () {
        let waiterFactoryObject = WaiterFactory(pool);
        await waiterFactoryObject.schedule('Mike', ['Wednesday', 'Friday', 'Sunday']);
        await waiterFactoryObject.schedule('Unalo', ['Wednesday', 'Saturday', 'Sunday']);
        await waiterFactoryObject.schedule('Nathri', ['Tuesday', 'Friday', 'Saturday']);
        await waiterFactoryObject.schedule('Greg', ['Monday', 'Tuesday', 'Sunday']);
        await waiterFactoryObject.schedule('Trinesh', ['Wednesday', 'Friday', 'Sunday']);
        let variable = await waiterFactoryObject.shiftStatus();
        assert.deepEqual(variable, [{
            weekday: 'Sunday',
            waiters: ['Mike', 'Unalo', 'Greg', 'Trinesh'],
            status: 'orange'
        },
        {
            weekday: 'Monday',
            waiters: ['Greg'],
            status: 'red'
        },
        {
            weekday: 'Tuesday',
            waiters: ['Nathri', 'Greg'],
            status: 'red'
        },
        {
            weekday: 'Wednesday',
            waiters: ['Mike', 'Unalo', 'Trinesh'],
            status: 'green'
        },
        {
            weekday: 'Thursday',
            waiters: [],
            status: 'red'
        },
        {
            weekday: 'Friday',
            waiters: ['Mike', 'Nathri', 'Trinesh'],
            status: 'green'
        },
        {
            weekday: 'Saturday',
            waiters: ['Unalo', 'Nathri'],
            status: 'red'
        }
        ]);
    });
    it('the reset function should clear all shifts for users', async function () {
        let waiterFactoryObject = WaiterFactory(pool);
        await waiterFactoryObject.schedule('Mike', ['Wednesday', 'Friday', 'Sunday']);
        let variable = await waiterFactoryObject.resetShifts();
        assert.deepEqual(variable, `All Shifts has been cleared`);
    });
    after(async function () {
        await pool.end();
    });
});
