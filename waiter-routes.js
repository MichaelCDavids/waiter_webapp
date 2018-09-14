module.exports = function (waiterFactory) {
    async function select (req, res) {
        let days = await waiterFactory.userShift(req.params.username);
        let data = {
            days
        };

        res.render('waiter', { data });
    };

    async function update (req, res) {
        let name = req.params.username;
        let shift = Array.isArray(req.body.days) ? req.body.days : [req.body.days];
        let message = await waiterFactory.schedule(name, shift);
        let data = {
            days: await waiterFactory.userShift(req.params.username)
        };
        req.flash('info', message);
        res.render('waiter', { data });
    };

    async function admin (req, res) {
        let all = await waiterFactory.orderByDay();
        
        res.render('admin', {all});
    };

    return {
        select,
        update,
        admin
    };
};
