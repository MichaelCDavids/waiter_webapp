module.exports = function (waiterFactory) {
    async function home (req,res) {
        res.render('home');
    } 
    async function select (req, res) {
        let days = await waiterFactory.shiftForUser(req.params.username);
        let data = { days };
        res.render('waiter', { data });
    };
    async function update (req, res) {
        let name = req.params.username;
        let shift = Array.isArray(req.body.days) ? req.body.days : [req.body.days];
        let message = await waiterFactory.schedule(name, shift);
        let data = { days: await waiterFactory.shiftForUser(req.params.username) };
        req.flash('info', message);
        res.render('waiter', { data });
    };
    async function admin (req, res) {
        // let all = await waiterFactory.dayOrder();
        let all = await waiterFactory.shiftStatus();
        res.render('admin', { all });
    };
    async function adminReset (req, res) {
        let message = await waiterFactory.resetShifts();
        req.flash('info', message);
        res.render('admin');
    };
    return {
        home,
        select,
        update,
        admin,
        adminReset
    };
};
