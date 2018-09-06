'use strict';
const assert = require('assert');
const WaiterFactory = require('../waiter-factory');
const pg = require('pg');
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres@localhost:5432/waiter_availability_test';
const pool = new Pool({
    connectionString
});

describe('The addRegistrationNumber function', function () {
    beforeEach(async function () {
        await pool.query('');
    });
    it('', async function () {
        let waiterFactoryObject = WaiterFactory(pool);
        let variable = await waiterFactoryObject.function();
        assert.strictEqual(variable, '');
    });
    after(async function () {
        await pool.end();
    });
});
