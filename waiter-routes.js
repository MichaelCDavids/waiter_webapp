module.exports = function (waiterFactory) {
    async function index (req, res) {
        res.render('index');
    };

    async function getWorkDays (req, res) {
        let name = req.params.username;
        console.log(name);
        res.render('waiter');
    };

    async function scheduleWorkDays (req, res) {
        let name = req.params.username;
        let shift = req.body.days;

        awa

        res.render('waiter', { shift });
    };
    async function admin (req, res) {
        res.render('admin');
    };

    return {
        index,
        getWorkDays,
        scheduleWorkDays,
        admin
    };
};
