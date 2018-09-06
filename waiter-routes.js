module.exports = function (waiterFactory) {
    async function index (req, res) {
        res.render('index');
    };

    return {
        index
    };
};
