module.exports = function (waiterFactory) {
    async function waiters (req, res) {
        let name = req.params.username;
        let data = {
            days: await waiterFactory.days(),
            shift: await waiterFactory.shift(name)
        };
        res.render('waiter', { data });
    };

    async function bookShift (req, res) {
        let name = req.params.username;
        let shift = req.body.days;
        await waiterFactory.schedule(name, shift);
        let data = {
            days: await waiterFactory.days(),
            shift: await waiterFactory.shift(name)
        };
        res.render('waiter', { data });
    };
    async function admin (req, res) {
        res.render('admin');
    };

    return {
        waiters,
        bookShift,
        admin
    };
};
