var router = require('express').Router();
var pass   = require('../config/pass');
var url    = require('url');

var userModel       = require('../config/dbschema').model.user              ;
var classModel      = require('../config/dbschema').model.class             ;
var moduleModel     = require('../config/dbschema').model.module            ;
var assignmentModel = require('../config/dbschema').model.assignment        ;

var classes = {
    lookup : function(req, res) {
        var input = url.parse(req.url, true).query;
        var id       = input.id       ;
        var name     = input.name     ;
        var category = input.category ;
        var website  = input.website  ;
        var grade    = input.grade    ;
        var teacher  = input.teacher  ;
        var query = {};

        if ( id       ) query._id      = id       ;
        if ( name     ) query.name     = name     ;
        if ( category ) query.category = category ;
        if ( website  ) query.website  = website  ;
        if ( grade    ) query.grade    = grade    ;
        if ( teacher  ) query.teacher  = teacher  ;
        if ( id || name || category || website || grade || teacher ) {
            classModel.find(query, function (err, docs) {
                var results = [];
                for (var x in docs) results.push({name     : docs[x].name     ,
                                                  category : docs[x].category ,
                                                  website  : docs[x].website  ,
                                                  grade    : docs[x].grade    ,
                                                  teacher  : docs[x].teacher  ,
                                                  desc     : docs[x].desc     ,
                                                  modules  : docs[x].modules  ,
                                                  id       : docs[x]._id      });
                res.send(results);
            });
        } else res.end();
    },
    create : function(req, res) {
        classModel.create(req.body, function(err, result) {
            if (err) {
                res.end('An error has occurred');
                return err;
            }
            res.send('Class ' + result._id + ' created successfully');
        });
    },
    update : function(req, res) {
        classModel.findById(req.body._id, function(err, selected) {
            if ( req.body.name     ) selected.name     = req.body.name     ;
            if ( req.body.category ) selected.category = req.body.category ;
            if ( req.body.website  ) selected.website  = req.body.website  ;
            if ( req.body.grade    ) selected.grade    = req.body.grade    ;
            if ( req.body.teacher  ) selected.teacher  = req.body.teacher  ;
            if ( req.body.desc     ) selected.desc     = req.body.desc     ;
            selected.save(function (err) {
                if (err) {
                    res.end('An error occurred');
                    return err;
                }
                res.end('Class ' + req.body._id + ' updated successfully');
            });
        });
    },
    remove : function(req, res) {
        classModel.remove({_id: url.parse(req.url, true).query.target}, function(err) {
            if (err) {
                res.end(err);
                return true;
            }
            res.end('Class ' + url.parse(req.url, true).query.target + ' removed successfully.');
        });
    },
    enroll : function(req, res) {
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
    drop : function(req, res) {
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
    getStudents : function(req, res) {
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
    },
    getProfile : function(req, res) {
        res.render('class', {
            user    : req.user          ,
            course  : req.doc           ,
            message : req.flash('info') ,
            error   : req.flash('error')
        });
    },
    module: {
        create : function(req, res) {
            req.body.class = req.doc._id;
            moduleModel.create(req.body, function(err, result) {
                if (err) {
                    res.end('An error has occurred');
                    console.log(err);
                    return err;
                }
                req.doc.modules.push(result._id);
                req.doc.save(function (err) {
                    if (err) {
                        res.end(err);
                        return true;
                    }
                    res.send('Module ' + result._id + ' created successfully');
                });
            });
        },
        update : function(req, res) {
            req.body.class = req.doc._id;
            moduleModel.where({ _id: req.params.module }).findOne(function(err, doc) {
                if (err) {
                    res.end(err);
                    return true;
                }
                
                if ( req.body.name ) doc.name = req.body.name;
                if ( req.body.desc ) doc.desc = req.body.desc;
                doc.save(function(err) {
                    if (err) {
                        res.end(err);
                        return true;
                    }
                    res.send('Module ' + doc._id + ' updated succesfully');
                });
            });
        },
        remove : function(req, res) {
            req.body.class = req.doc._id;
            moduleModel.remove({_id: req.params.module}, function(err) {
                if (err) {
                    res.end(err);
                    return true;
                }
                req.doc.modules.splice(req.doc.modules.indexOf(req.params.module), 1);
                req.doc.save(function (err) {
                    if (err) {
                        res.end(err);
                        return true;
                    }
                    res.send('Module ' + req.params.module + ' removed successfully');
                });
            });
        },
        info : function(req, res) {
            moduleModel.findById(req.params.module, function(err, selected) {
                if (err) {
                    res.end(err);
                    return true;
                }
                
                res.send({
                    id         : selected._id       ,
                    name       : selected.name      ,
                    desc       : selected.desc      ,
                    activities : selected.activities
                });
            });
        },
        activity : {
            create : function(req, res) {
                req.body.module = req.doc._id;
                if ( req.body.type == 'quiz' ) {
                    assignmentModel.create(req.body, function(err, result) {
                        if (err) {
                            res.end('An error has occurred');
                            console.log(err);
                            return err;
                        }
                        req.doc.activities.push(result._id);
                        req.doc.save(function (err) {
                            if (err) {
                                res.end(err);
                                return true;
                            }
                            res.send('Activity ' + result._id + ' created successfully');
                        });
                    });
                }
                if ( req.body.type == 'survey' ) {
                    assignmentModel.create(req.body, function(err, result) {
                        if (err) {
                            res.end('An error has occurred');
                            console.log(err);
                            return err;
                        }
                    });
                }
                if ( req.body.type == 'essay' ) {
                    assignmentModel.create(req.body, function(err, result) {
                        if (err) {
                            res.end('An error has occurred');
                            console.log(err);
                            return err;
                        }
                    });
                }
                if ( req.body.type == 'upload' ) {
                    assignmentModel.create(req.body, function(err, result) {
                        if (err) {
                            res.end('An error has occurred');
                            console.log(err);
                            return err;
                        }
                    });
                }
                if ( req.body.type == 'forum' ) {
                    assignmentModel.create(req.body, function(err, result) {
                        if (err) {
                            res.end('An error has occurred');
                            console.log(err);
                            return err;
                        }
                    });
                }
                if ( req.body.type == 'external' ) {
                    assignmentModel.create(req.body, function(err, result) {
                        if (err) {
                            res.end('An error has occurred');
                            console.log(err);
                            return err;
                        }
                    });
                }
            },
            update : function(req, res) {
                
            },
            remove : function(req, res) {
                
            },
            info : function(req, res) {
                assignmentModel.findById(req.params.activity, function(err, selected) {
                    if (err) {
                        res.end(err);
                        return true;
                    }
                
                    res.send({
                        id         : selected._id       ,
                        name       : selected.name      ,
                        desc       : selected.desc      ,
                        type       : selected.type
                    });
                });
            },
            render : function(req, res) {
                
            }
        }
    }
}

function findClass(req, res, next) {
    classModel.where({ _id: req.params.class }).findOne(function(err, doc) {
        if (err) {
            res.end('An error has occured');
            return true;
        }
        req.doc = doc;
        next();
    });
}

function findModule(req, res, next) {
    moduleModel.where({ _id: req.params.module }).findOne(function(err, doc) {
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

router.post('/:class/enroll', pass.atleastTeacher, findClass, classes.enroll );
router.post('/:class/drop'  , pass.atleastTeacher, findClass, classes.drop   );

router.post('/:class/module/create'        , pass.atleastTeacher, findClass, classes.module.create );
router.post('/:class/module/:module/update', pass.atleastTeacher, findClass, classes.module.update );

router.get('/:class/module/:module/remove', pass.atleastTeacher, findClass, classes.module.remove );
router.get('/:class/module/:module/info'  , pass.atleastStudent, findClass, classes.module.info   );

router.post('/:class/module/:module/activity/create'          , pass.atleastTeacher, findModule, classes.module.activity.create );
router.post('/:class/module/:module/activity/:activity/update', pass.atleastTeacher, findModule, classes.module.activity.update );

router.get('/:class/module/:module/activity/:activity/remove', pass.atleastTeacher, findModule, classes.module.activity.remove );
router.get('/:class/module/:module/activity/:activity/info'  , pass.atleastTeacher, findModule, classes.module.activity.info   );
router.get('/:class/module/:module/activity/:activity/'      , pass.atleastTeacher, findModule, classes.module.activity.render );

router.get('/:class/students', pass.atleastTeacher, findClass, classes.getStudents );
router.get('/:class/'        , pass.atleastStudent, findClass, classes.getProfile  );

module.exports = router;