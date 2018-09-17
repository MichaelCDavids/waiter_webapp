'use strict';
const assert = require('assert');
const WaiterFactory = require('../waiter-factory');
const pg = require('pg');
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://muji:pg123@localhost:5432/waiter_availability_test';
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
        assert.deepStrictEqual(days, [{ 'day_name': 'Monday' }, { 'day_name': 'Tuesday' }, { 'day_name': 'Wednesday' }, { 'day_name': 'Thursday' }, { 'day_name': 'Friday' }, { 'day_name': 'Saturday' },{ 'day_name': 'Sunday' }]);
    });

    // it('should return a list of days a waiter is booked for', async function () {
    //     let waiterFactoryObject = WaiterFactory(pool);
    //     await waiterFactoryObject.schedule('Michael', ['Wednesday', 'Friday', 'Sunday']);
    //     let variable = await waiterFactoryObject.getShift('Michael');
    //     assert.deepEqual(variable, [{
    //         day_name: 'Wednesday'
    //     },
    //     {
    //         day_name: 'Friday'
    //     },
    //     {
    //         day_name: 'Sunday'
    //     }
    //     ]);
    // });

    // it('should');

    after(async function () {
        await pool.end();
    });
});
