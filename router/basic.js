var router   = require('express').Router();
var pass     = require('../config/pass');
var passport = require('passport');

// Render account
function account(req, res) { res.render('account', { user: req.user }) };

// Render login, if message, flash as error
function getLogin(req, res) {
    if (!req.user) res.render('login', { message: req.flash('error') });
    else res.redirect('/');
};

// Attempt to authenticate the login request
function postLogin(req, res) {
    if (!req.user) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err) }
            if (!user) {
                req.flash('error', [info.message]);
                return res.redirect('/login')
            }
            req.logIn(user, function(err) {
                if (err) return next(err);
                return res.redirect('/');
            });
        })(req, res);
    }
};
// Logout, redirect
function logout(req, res) {
    req.logout();
    res.redirect('/');
};
// Render dashboard, send user variable for permissions/role authentification
function dashboard(req, res) {
    if (!req.user) res.render('index', { user: req.user, message: req.flash('info') });
    res.render('dashboard', {user: req.user});
}

// Handle GET requests
router.get('/'         ,                           dashboard );
router.get('/account'  , pass.ensureAuthenticated, account   );
router.get('/login'    ,                           getLogin  );
router.get('/logout'   ,                           logout    );

// Handle POST requests
router.post('/login', postLogin);

module.exports = router;