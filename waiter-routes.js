module.exports = function (waiterFactory) {
    async function home (req, res) {
        res.render('home');
    }

    async function waiters (req, res) {
        let data = {
            days: await waiterFactory.days()
        };

        res.render('waiter', { data });
    };

    async function bookShift (req, res) {
        let name = req.params.username;
        let shift = req.body.days;

        await waiterFactory.schedule(name, shift);

        let data = {
            days: await waiterFactory.days()
        };

        res.render('waiter', { data });
    };

    async function admin (req, res) {
        let data = {
            days: await waiterFactory.dayWaiter()
        };

        res.render('admin', { data });
    };

    return {
        home,
        waiters,
        bookShift,
        admin
    };
};
