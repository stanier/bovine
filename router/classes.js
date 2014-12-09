var router = require('express').Router();
var pass   = require('../config/pass');

var url        = require('url');
var userModel  = require('../config/dbschema').model.user;
var classModel = require('../config/dbschema').model.class;

var classes = {
    lookup: function(req, res) {
        var input = url.parse(req.url, true).query;
        var id       = input.id       ;
        var name     = input.name     ;
        var category = input.category ;
        var website  = input.website  ;
        var grade    = input.grade    ;
        var teacher  = input.teacher  ;
        var query = {};

        if (id       ) query._id      = id       ;
        if (name     ) query.name     = name     ;
        if (category ) query.category = category ;
        if (website  ) query.website  = website  ;
        if (grade    ) query.grade    = grade    ;
        if (teacher  ) query.teacher  = teacher  ;
        if (id || name || category || website || grade || teacher) {
            classModel.find(query, function (err, docs) {
                var results = [];
                for (var x in docs) results.push({name     : docs[x].name     ,
                                                  category : docs[x].category ,
                                                  website  : docs[x].website  ,
                                                  grade    : docs[x].grade    ,
                                                  teacher  : docs[x].teacher  ,
                                                  desc     : docs[x].desc     ,
                                                  id       : docs[x]._id      });
                res.send(results);
            });
        } else res.end();
    },
    create: function(req, res) {
        classModel.create(req.body, function(err, result) {
            if (err) {
                res.end('An error has occurred');
                return err;
            }
            res.send('Class ' + result._id + ' created successfully');
        });
    },
    update: function(req, res) {
        classModel.findById(req.body._id, function(err, selected) {
            if (req.body.name     ) selected.name     = req.body.name     ;
            if (req.body.category ) selected.category = req.body.category ;
            if (req.body.website  ) selected.website  = req.body.website  ;
            if (req.body.grade    ) selected.grade    = req.body.grade    ;
            if (req.body.teacher  ) selected.teacher  = req.body.teacher  ;
            if (req.body.desc     ) selected.desc     = req.body.desc     ;
            selected.save(function (err) {
                if (err) {
                    res.end('An error occurred');
                    return err;
                }
                res.end('Class ' + req.body._id + ' updated successfully');
            });
        });
    },
    remove: function(req, res) {
        classModel.remove({_id: url.parse(req.url, true).query.target}, function(err) {
            if (err) {
                res.end(err);
                return true;
            }
            res.end('Class ' + url.parse(req.url, true).query.target + ' removed successfully.');
        });
    },
    enroll: function(req, res) {
        userModel.findById(req.body.student, function(err, selected) {
            if (err) {
                res.end(err);
                return true;
            }
            if (selected.role != 1) {
                res.end('User ' + req.body.student + ' is not a student and cannot be enrolled in a class');
                return true;
            }
            req.doc.enrolled.push(req.body.student);
            req.doc.save(function (err) {
                if (err) {
                    res.end(err);
                    return true;
                }
                res.end('Student ' + req.body.student + ' enrolled to ' + req.doc.name + ' successfully');
            });
        });
    },
    drop: function(req, res) {
        userModel.findById(req.body.student, function(err, selected) {
            if (err) {
                res.end(err);
                return true;
            }
            req.doc.enrolled.splice(req.doc.enrolled.indexOf(req.body.student));
            req.doc.save(function (err) {
                if (err) {
                    res.end(err);
                    return true;
                }
                res.send('Student ' + req.body.student + ' dropped from ' + req.doc.name + ' successfully');
            });
        });
    },
    getStudents: function(req, res) {
        if (url.parse(req.url, true).query.detailed == 'true') {
            var response = [];
            if (req.doc.enrolled.length == 0) res.send(req.doc.enrolled);
            for (var i = 0; i < req.doc.enrolled.length; i++) {
                userModel.where({ _id: req.doc.enrolled[i] }).findOne(function(err, doc) {
                    if (err) {
                        res.end('An error has occured');
                        return true;
                    }
                    if (!doc) req.doc.enrolled.splice(req.doc.enrolled.indexOf(req.doc.enrolled[i]));
                    else response.push(doc);
                    if(response.length == req.doc.enrolled.length) res.send(response);
                });
            }
        } else res.send(req.doc.enrolled);
    }
}

function findClass(req, res, next) {
    classModel.where({ _id: req.params.id }).findOne(function(err, doc) {
        if (err) {
            res.end('An error has occured');
            return true;
        }
        req.doc = doc;
        next();
    });
}

router.get('/lookup', pass.atleastStudent, classes.lookup );
router.get('/remove', pass.atleastManager, classes.remove );

router.post('/create', pass.atleastManager, classes.create );
router.post('/update', pass.atleastTeacher, classes.update );

router.post('/:id/enroll', pass.atleastTeacher, findClass, classes.enroll );
router.post('/:id/drop', pass.atleastTeacher, findClass, classes.drop );

router.get('/:id/students', pass.atleastTeacher, findClass, classes.getStudents );

module.exports = router;