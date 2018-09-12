module.exports = function (waiterFactory) {
    
    
    
    async function home (req,res) {
        res.render('home');
    }
    
    
    
    
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
        
        let data = {
            days : await waiterFactory.dayWaiter(),
        };
        
        res.render('admin', { data });
    };


    async function adminPost (req, res) {
        await waiterFactory.reset();
        res.redirect('home');
    };

    return {
        home,
        waiters,
        bookShift,
        admin,
        adminPost
    };
};
