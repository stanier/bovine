var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./dbschema');

passport.serializeUser(  function(user, next) { next(null, user.id)                                                  });
passport.deserializeUser(function(id  , next) { db.model.user.findById(id, function (err, user) { next(err, user) }) });

passport.use(new LocalStrategy(function(username, password, next) {
    db.model.user.findOne({ username: username }, function(err, user) {
        if (err) return next(err);
        
        if (!user) return next(null, false, { message: 'Unknown user ' + username });
        
        user.comparePassword(password, function(err, isMatch) {
            if (err) return next(err);
            
            if (isMatch) return next(null, user);
            else return next(null, false, { message: 'Invalid password' });
        });
    });
}));

exports.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) return next();
    
    res.redirect('/login')
}

exports.ensureAdmin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return false;
    }
    
    if (req.user && req.user.role == 4) next();
    else res.sendStatus(403);
}
exports.atleastManager = function(req, res, next) {
    if (req.isAuthenticated()) return next();
    
    res.redirect('/login');
    
    if (req.user && req.user.role >= 3) next();
    else res.sendStatus(403);
}
exports.ensureManager = function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return false;
    }
    
    if (req.user && req.user.role == 3) next();
    else res.sendStatus(403);
}
exports.atleastTeacher = function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return false;
    }
    
    if (req.user && req.user.role >= 2) next();
    else res.sendStatus(403);
}
exports.ensureTeacher = function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return false;
    }
    
    if (req.user && req.user.role == 2) next();
    else res.sendStatus(403);
}
exports.atleastStudent = function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return false;
    }
    
    if (req.user && req.user.role >= 1) next();
    else res.sendStatus(403);
}
exports.ensureStudent = function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return false;
    }
    
    if (req.user && req.user.role == 1) next();
    else res.sendStatus(403);
}