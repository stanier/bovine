 var router   = require('express').Router();
var pass     = require('../util/pass');
var passport = require('passport');

// Render account
function account(req, res) {
    res.render('account', {
        user    : req.user,
        message : req.flash('info' ),
        error   : req.flash('error')
    });
};

// Render login, if message, flash as error
function getLogin(req, res) {
    if (!req.user) res.render('login', {
        // user is not passed as it is null
        message : req.flash('info' ),
        error   : req.flash('error')
    });
    else res.redirect('/');
};

// Attempt to authenticate the login request
function postLogin(req, res) {
    if (!req.user) {
        passport.authenticate('local', function(err, user, message) {
            if (err) { return next(err) }
            if (!user) {
                req.flash('error', [message.message]);
                return res.redirect('/login')
            }
            req.logIn(user, function(err) {
                if (err) return next(err);
                return res.redirect('/');
            });
        })(req, res);
    } else res.redirect('/');
};
// Logout, redirect
function logout(req, res) {
    req.logout();
    res.redirect('/');
};
// Render dashboard, send user variable for permissions/role authentification
function dashboard(req, res) {
    // Render the frontpage only when not logged in
    if (!req.user) res.render('index', {
        // user is not passed as it is null
        message : req.flash('info' ),
        error   : req.flash('error')
    });
    // Render the dashboard when logged in
    else res.render('dashboard', {
        user    : req.user,
        message : req.flash('info' ),
        error   : req.flash('error')
    });
}

// Handle GET requests
router.get('/'         ,                           dashboard );
router.get('/account'  , pass.ensureAuthenticated, account   );
router.get('/login'    ,                           getLogin  );
router.get('/logout'   ,                           logout    );

// Handle POST requests
router.post('/login', postLogin);

module.exports = router;