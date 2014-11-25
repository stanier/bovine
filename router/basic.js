var express = require('express');
var router = express.Router();
var pass = require('../config/pass');

var passport = require('passport');

function index(req, res) {
    if (!req.user) res.render('index', { user: req.user, message: req.flash('info') });
    else res.render('home', { user: req.user, message: req.flash('info')});
};
function account(req, res) {
    res.render('account', { user: req.user });
};
function getLogin(req, res) {
    if (!req.user) res.render('login', { message: req.flash('error') });
    else res.redirect('/');
};
function postLogin(req, res, next) {
    if (!req.user) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err) }
            if (!user) {
                //req.session.messages =  [info.message];
                req.flash('error', [info.message]);
                return res.redirect('/login')
            }
            req.logIn(user, function(err) {
                if (err) return next(err);
                return res.redirect('/');
            });
        })(req, res, next);
    }
};
function logout(req, res) {
    req.logout();
    res.redirect('/');
};
function dashboard(req, res) {
    if (!req.user) return res.redirect('/');
    res.render('dashboard/dashboard', {user: req.user});
}

router.get('/', index);
router.get('/account', pass.ensureAuthenticated, account);
router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/logout', logout);
router.get('/dashboard', dashboard);

module.exports = router;