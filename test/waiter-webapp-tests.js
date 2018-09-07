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
        let variable = await waiterFactoryObject.chooseDays();
        assert.strictEqual(variable, 'This function should set days a waiter is available');
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

    after(async function () {
        await pool.end();
    });
});
