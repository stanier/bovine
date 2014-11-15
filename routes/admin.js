var url = require('url');
var passport = require('passport');
var mongoose = require('mongoose');
var user = require('../config/dbschema.js').userModel;

// Allow for use of user object in exporting
exports.user = {};

// API-like
exports.lookup = function(req, res) {
    if (checkAdmin(req) == false) {
        res.end();
        return false;
    }
    
    var input = url.parse(req.url, true).query;
    var username = input.username;
    var firstName = input.firstName;
    var middleName = input.middleName;
    var lastName = input.lastName;
    var email = input.email;
    var query = {};

    if (username) query.username = username;
    if (firstName) query.firstName = firstName;
    if (middleName) query.middleName = middleName;
    if (lastName) query.lastName = lastName;
    if (email) query.email = email;
    if (username || firstName || middleName || lastName || email) {
        user.find(query, function (err, docs) {
            var results = [];
            for (var x in docs) results.push({username:docs[x].username,
                                              firstName:docs[x].firstName,
                                              middleName:docs[x].middleName,
                                              lastName:docs[x].lastName,
                                              email:docs[x].email, 
                                              id:docs[x]._id});
            res.send(results);
        });
    }
}

// API-like
exports.user.create = function(req, res) {
    if (checkAdmin(req) == false) {
        res.end('Insufficient privileges');
        return true;
    }
    
    user.create(req.body, function(err, result) {
        if (err) {
            res.end('An error has occurred');
            return err;
        }
        res.send('User ' + result._id + ' created successfully');
    });
}
// API-like
exports.user.update = function(req, res) {
    if (checkAdmin(req) == false) {
        res.end('Insufficient privileges');
        return true;
    }
    
    user.findByIdAndUpdate(req.body._id, req.body, function(err, result){
        if (err) {
            res.end('An error occurred');
            return err;
        }
        console.log('User ' + req.body._id + ' updated successfully');
        res.end('User updated successfully');
    });
}

// Renders page
exports.user.edit = function(req, res) {
    checkAdminAndRender(req, res, function() {
        user.find({_id: url.parse(req.url, true).query.target}, function(err, docs) {
            res.render('dashboard/user/edit', {user: req.user, target: docs[0]});
        });
    });
}

// API-like
exports.user.remove = function(req, res) {
    if(checkAdmin(req) == false) {
        res.end('Insufficient privileges');
        return true;
    }
    
    user.remove({_id: url.parse(req.url, true).query.target}, function(err) {
        if (err) {
            res.end(err);
            return true;
        }
        res.end('User ' + url.parse(req.url, true).query.target + ' removed successfully.');
    });
}

// Admin privilege checking, may later be moved to a privileges file
function checkAdminAndRender(req, res, callback) {
    // Check admin, render denied page if failed, used for rendered resources
    if (!req.user) res.redirect('/');
    if (req.user.role == 'admin') callback();
    else res.render('denied', {user: req.user});
}
function checkAdmin(req) {
    // Check admin, no rendering
    if (!req.user) res.redirect('/');
    if (req.user.role == 'admin') return true;
    else return false;
}