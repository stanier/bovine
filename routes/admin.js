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
                for (var x in docs) results.push({username:docs[x].username, email:docs[x].email, id:docs[x]._id});
                res.send(results);
            });
        }
    });
};

exports.user = {};

exports.user.update = function(req, res) {
    checkAdmin(req, res, function() {
        req.on('data', function (chunk) {
            body += chunk;
        });
        req.on('end', function () {
            console.log('POSTed: ' + body);
            res.writeHead(200);
            res.end(postHTML);
        });
    });
}

exports.user.edit = function(req, res) {
    checkAdmin(req, res, function() {
        user.find({_id: url.parse(req.url, true).query.target}, function (err, docs) {
            res.render('dashboard/user/edit', {user: req.user, target: docs[0]});
        });
    });
}

function checkAdmin(req, res, callback) {
    if (!req.user) res.redirect('/');
    if (req.user.role == 'admin') callback();
    else res.render('denied', {user: req.user});
}