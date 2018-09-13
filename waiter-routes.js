module.exports = function (waiterFactory) {
    
    async function select (req, res) { 
        let days= await waiterFactory.userShift(req.params.username)
        let data = {
            days
        };

        res.render('waiter', { data });
    };

    async function update (req, res) {
        let name = req.params.username;
        let shift = Array.isArray(req.body.days) ? req.body.days : [req.body.days];
        await waiterFactory.schedule(name, shift);
        let data = {
            days: await waiterFactory.userShift(req.params.username)
        };
        res.render('waiter', { data });
    };

    async function admin (req, res) { 
        
        let days = await waiterFactory.days()
        
        let data = {
            days
        };
        
        res.render('admin',{data});
    };

    return {
        select,
        update,
        admin
    };
};
