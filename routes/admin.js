var url = require('url');
var passport = require('passport');
var mongoose = require('mongoose');
var user = require('../config/dbschema.js').userModel;

exports.lookup = function(req, res) {
    checkAdmin(req, res, function() {
        var input = url.parse(req.url, true).query;
        var username = input.username;
        var email = input.email;
        var id = input.id;
        var query = {};
        
        if (username != null && username != '') { query.username = username; }
        if (email != null && username != '') { query.email = email; }
        if (id != null && id != '') { query.id = id; }
        if (username || email || id) {
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
    });
};

exports.user = {};

exports.user.create = function(req, res) {
    checkAdmin(req, res, function() {
        user.create(req.body, function(err, result) {
            if (err) {
                var message = err.message + '.';
                for (var i; i < ) {
                    console.log('FIELD:  ' + field);
                }
                res.send(message);
                console.log(err);
                return err;
            }
            res.send('User ' + result._id + ' created successfully');
        });
    });
}
exports.user.update = function(req, res) {
    checkAdmin(req, res, function() {
        user.findByIdAndUpdate(req.body._id, req.body, function(err, result){
            if (err) {
                res.send('An error occurred');
                return err;
            }
            console.log('User ' + req.body._id + ' updated successfully');
            res.send('User updated successfully');
        });
    });
}

exports.user.edit = function(req, res) {
    checkAdmin(req, res, function() {
        user.find({_id: url.parse(req.url, true).query.target}, function(err, docs) {
            res.render('dashboard/user/edit', {user: req.user, target: docs[0]});
        });
    });
}
exports.user.add = function(req, res) {
    checkAdmin(req, res, function(){
        res.render('dashboard/user/add');
    });
}

function checkAdmin(req, res, callback) {
    if (!req.user) res.redirect('/');
    if (req.user.role == 'admin') callback();
    else res.render('denied', {user: req.user});
}