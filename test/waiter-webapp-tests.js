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
        let shift = await waiterFactoryObject.getShift('Michael');
        assert.deepEqual(shift, [{
            day_name: 'Monday'
        },
        {
            day_name: 'Wednesday'
        },
        {
            day_name: 'Friday'
        }
        ]);
    });

    it('should return a list of days a waiter is booked for', async function () {
        let waiterFactoryObject = WaiterFactory(pool);
        await waiterFactoryObject.schedule('Michael', ['Wednesday', 'Friday', 'Sunday']);
        let variable = await waiterFactoryObject.getShift('Michael');
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


    // it('should');

    after(async function () {
        await pool.end();
    });
});
