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

    it('should allow a waiter to choose days that he/she can work on', async function () {
        let waiterFactoryObject = WaiterFactory(pool);
        await waiterFactoryObject.schedule('Michael', ['Monday', 'Wednesday', 'Friday']);
        let variable = await waiterFactoryObject.shift('Michael');
        assert.deepEqual(variable, ['Monday', 'Wednesday', 'Friday']);
    });

    it('should return a list of days a waiter is booked for', async function () {
        let waiterFactoryObject = WaiterFactory(pool);
        await waiterFactoryObject.schedule('Michael', ['Wednesday', 'Friday', 'Sunday']);
        let variable = await waiterFactoryObject.shift('Michael');
        assert.deepEqual(variable, ['Wednesday', 'Friday', 'Sunday']);
    });

    it('should return a list of days for the week', async function () {
        let waiterFactoryObject = WaiterFactory(pool);
        let variable = await waiterFactoryObject.days();
        assert.deepEqual(variable, [{
            day_name: 'Sunday'
        },
        {
            day_name: 'Monday'
        },
        {
            day_name: 'Tuesday'
        },
        {
            day_name: 'Wednesday'
        },
        {
            day_name: 'Thursday'
        },
        {
            day_name: 'Friday'
        },
        {
            day_name: 'Saturday'
        }
        ]);
    });

    // it('should clear shifts for one week', async function () {
    //     let waiterFactoryObject = WaiterFactory(pool);
    //     let variable = await waiterFactoryObject.function();
    //     assert.strictEqual(variable, '');
    // });

    // it('should', async function () {
    //     let waiterFactoryObject = WaiterFactory(pool);
    //     let variable = await waiterFactoryObject.function();
    //     assert.strictEqual(variable, '');
    // });

    // after(async function () {
    //     await pool.end();
    // });
});
