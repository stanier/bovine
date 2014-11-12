var passport = require('passport');

// Render account
exports.account = function(req, res) {
    res.render('account', { user: req.user });
};
// Render login page
exports.getlogin = function(req, res) {
    if (!req.user) {
        res.render('login', {  message: req.session.messages });
    } else {
        res.redirect('/');
    }
};
// Process login request
exports.postlogin = function(req, res, next) {
    if (!req.user) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err) }
            if (!user) {
                req.session.messages =  [info.message];
                return res.redirect('/login')
            }
            req.logIn(user, function(err) {
                if (err) return next(err);
                return res.redirect('/');
            });
        })(req, res, next);
    }
};
// Log out of the session
exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};
// Render dashboard
exports.dashboard = function(req, res) {
    if (!req.user) {
        return res.redirect('/');
    }
    res.render('dashboard/dashboard', {user: req.user});
}