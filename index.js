const flash = require('express-flash');
const session = require('express-session');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const WaiterFactory = require('./waiter-factory');
const WaiterRoutes = require('./waiter-routes');

const pg = require('pg');
const Pool = pg.Pool;

let useSSL = false;
let local = process.env.LOCAL || false;

if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://muji:pg123@localhost:5432/waiter_availability';

const pool = new Pool({
    connectionString,
    ssl: useSSL
});

let app = express();

app.use(session({
    secret: 'This is a secret message',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

let waiterFactory = WaiterFactory(pool);
let waiterRoutes = WaiterRoutes(waiterFactory);

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.get('/',waiterRoutes.home);
app.get('/waiters/:username', waiterRoutes.waiters);
app.post('/waiters/:username', waiterRoutes.bookShift);
app.get('/days', waiterRoutes.admin);

let PORT = process.env.PORT || 3009;

app.listen(PORT, function () {
    console.log('Waiter Availability WebApp started successfully and is now running on port: ', PORT);
});
