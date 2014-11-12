exports.index = function(req, res) {
    if(!req.user) res.render('index', { user: req.user });
    else res.render('home', { user: req.user});
};