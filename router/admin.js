var express = require('express');
var router = express.Router();
var pass = require('../config/pass');

var url = require('url');
var passport = require('passport');
var mongoose = require('mongoose');
var userModel = require('../config/dbschema').model.user;
var classModel = require('../config/dbschema').model.class;
var schoolModel = require('../config/dbschema').model.school;

var user = {
    lookup: function(req, res) {
        if (!checkAdmin(req)) {
            res.end();
            return false;
        }
    
        var input = url.parse(req.url, true).query;
        var id = input.id;
        var username = input.username;
        var firstName = input.firstName;
        var middleName = input.middleName;
        var lastName = input.lastName;
        var email = input.email;
        var role = input.role;
        var query = {};

        if (id) query._id = id;
        if (username) query.username = username;
        if (firstName) query.firstName = firstName;
        if (middleName) query.middleName = middleName;
        if (lastName) query.lastName = lastName;
        if (email) query.email = email;
        if (role) query.role = role;
        if (username || firstName || middleName || lastName || email || role || id) {
            userModel.find(query, function (err, docs) {
                var results = [];
                for (var x in docs) results.push({username:docs[x].username,
                                                  firstName:docs[x].firstName,
                                                  middleName:docs[x].middleName,
                                                  lastName:docs[x].lastName,
                                                  email:docs[x].email, 
                                                  role:docs[x].role,
                                                  id:docs[x]._id});
                res.send(results);
            });
        } else { res.end() }
    },
    create: function(req, res) {
        if (!checkAdmin(req)) {
            res.end('Insufficient privileges');
            return true;
        }
    
        userModel.create(req.body, function(err, result) {
            if (err) {
                res.end('An error has occurred');
                return err;
            }
            res.send('User ' + result._id + ' created successfully');
        });
    },
    update: function(req, res) {
        if (!checkAdmin(req)) {
            res.end('Insufficient privileges');
            return true;
        }
    
        userModel.findById(req.body._id, function(err, selected) {
            if (req.body.username) selected.username = req.body.username;
            if (req.body.email) selected.email = req.body.email;
            if (req.body.password) selected.password = req.body.password;
            if (req.body.firstName) selected.fistName = req.body.firstName;
            if (req.body.middleName) selected.middleName = req.body.middleName;
            if (req.body.lastName) selected.lastName = req.body.lastName;
            if (req.body.school) selected.school = req.body.school;
            if (req.body.role) selected.role = req.body.role;
            if (req.body.grade) selected.grade = req.body.grade;
            selected.save(function (err) {
                if (err) {
                    res.end('An error occurred');
                    return err;
                }
                console.log('User ' + req.body._id + ' updated successfully');
                res.end('User updated successfully');
            });
        });
    },
    remove: function(req, res) {
        if(checkAdmin(req) == false) {
            res.end('Insufficient privileges');
            return true;
        }
        userModel.remove({_id: url.parse(req.url, true).query.target}, function(err) {
            if (err) {
                res.end(err);
                return true;
            }
            res.end('User ' + url.parse(req.url, true).query.target + ' removed successfully.');
        });
    }
}

var classes = {
    lookup: function(req, res) {
        if (!checkAdmin(req)) {
            res.end();
            return false;
        }
    
        var input = url.parse(req.url, true).query;
        var id = input.id;
        var name = input.name;
        var category = input.category;
        var website = input.website;
        var grade = input.grade;
        var query = {};

        if (id) query._id = id;
        if (name) query.name = name;
        if (category) query.category = category;
        if (website) query.website = website;
        if (grade) query.grade = grade;
        if (id || name || category || website || grade) {
            classModel.find(query, function (err, docs) {
                var results = [];
                for (var x in docs) results.push({name:docs[x].name,
                                                  category:docs[x].category,
                                                  website:docs[x].website,
                                                  grade:docs[x].grade,
                                                  id:docs[x]._id});
                res.send(results);
            });
        } else {
            res.end();
        }
    },
    create: function(req, res) {
        if (!checkAdmin(req)) {
            res.end('Insufficient privileges');
            return true;
        }
    
        classModel.create(req.body, function(err, result) {
            if (err) {
                res.end('An error has occurred');
                return err;
            }
            res.send('class ' + result._id + ' created successfully');
        });
    },
    update: function(req, res) {
        if (!checkAdmin(req)) {
            res.end('Insufficient privileges');
            return true;
        }
    
        classModel.findById(req.body._id, function(err, selected) {
            if (req.body.name) selected.name = req.body.name;
            if (req.body.category) selected.category = req.body.category;
            if (req.body.website) selected.website = req.body.website;
            if (req.body.grade) selected.grade = req.body.grade;
            selected.save(function (err) {
                if (err) {
                    res.end('An error occurred');
                    return err;
                }
                console.log('Class ' + req.body._id + ' updated successfully');
                res.end('Class updated successfully');
            });
        });
    },
    remove: function(req, res) {
        if(checkAdmin(req) == false) {
            res.end('Insufficient privileges');
            return true;
        }
        classModel.remove({_id: url.parse(req.url, true).query.target}, function(err) {
            if (err) {
                res.end(err);
                return true;
            }
            res.end('classes ' + url.parse(req.url, true).query.target + ' removed successfully.');
        });
    }
}

var school = {
    lookup: function(req, res) {
        if (!checkAdmin(req)) {
            res.end();
            return false;
        }
    
        var input = url.parse(req.url, true).query;
        var id = input.id;
        var name = input.name;
        var type = input.type;
        var query = {};

        if (id) query._id = id;
        if (name) query.name = name;
        if (type) query.type = type;
        if (id || name || type) {
            schoolModel.find(query, function (err, docs) {
                var results = [];
                for (var x in docs) results.push({name:docs[x].name,
                                                  type:docs[x].type,
                                                  website:docs[x].website,
                                                  zipcode:docs[x].zipcode,
                                                  district:docs[x].district,
                                                  city:docs[x].city,
                                                  state:docs[x].state,
                                                  id:docs[x]._id});
                res.send(results);
            });
        } else { res.end() }
    },
    create: function(req, res) {
        if (!checkAdmin(req)) {
            res.end('Insufficient privileges');
            return true;
        }
    
        schoolModel.create(req.body, function(err, result) {
            if (err) {
                res.end('An error has occurred');
                return err;
            }
            res.send('School ' + result._id + ' created successfully');
        });
    },
    update: function(req, res) {
        if (!checkAdmin(req)) {
            res.end('Insufficient privileges');
            return true;
        }
    
        schoolModel.findById(req.body._id, function(err, selected) {
            if (req.body.name) selected.name = req.body.name;
            if (req.body.type) selected.type = req.body.type;
            selected.save(function (err) {
                if (err) {
                    res.end('An error occurred');
                    return err;
                }
                console.log('School ' + req.body._id + ' updated successfully');
                res.end('School updated successfully');
            });
        });
    },
    remove: function(req, res) {
        if(checkAdmin(req) == false) {
            res.end('Insufficient privileges');
            return true;
        }
        schoolModel.remove({_id: url.parse(req.url, true).query.target}, function(err) {
            if (err) {
                res.end(err);
                return true;
            }
            res.end('School ' + url.parse(req.url, true).query.target + ' removed successfully.');
        });
    }
}

// Admin privilege checking, may later be moved to a privileges file
function checkAdminAndRender(req, res, callback) {
    // Check admin, render denied page if failed, used for rendered resources
    if (!req.user) res.redirect('/');
    if (req.user.role == 4) callback();
    else res.render('denied', {user: req.user});
}
function checkAdmin(req) {
    // Check admin, no rendering
    if (!req.user) res.end();
    if (req.user.role == 4) return true;
    else return false;
}

// Allow for use of user, classes and school objects in exporting
router.get('/user/lookup', pass.ensureAdmin, user.lookup);
router.get('/user/remove', pass.ensureAdmin, user.remove);
router.get('/class/lookup', pass.ensureAdmin, classes.lookup);
router.get('/class/remove', pass.ensureAdmin, classes.remove);
router.get('/school/lookup', pass.ensureAdmin, school.lookup);
router.get('/school/remove', pass.ensureAdmin, school.remove);

//API-like routing
router.post('/user/create', pass.ensureAdmin, user.create);
router.post('/user/update', pass.ensureAdmin, user.update);
router.post('/class/create', pass.ensureAdmin, classes.create);
router.post('/class/update', pass.ensureAdmin, classes.update);
router.post('/school/create', pass.ensureAdmin, school.create);
router.post('/school/update', pass.ensureAdmin, school.update);

module.exports = router;