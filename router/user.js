var router = require('express').Router();
var pass   = require('../config/pass');

var url        = require('url');
var userModel  = require('../config/dbschema').model.user;
var classModel = require('../config/dbschema').model.class;

// Get all the classes the user is enrolled in
function getEnrolledIn(req, res) {
    classModel.find({ enrolled: req.user.id }, function(err, docs) {
        if (err) {
            res.end('An error has occured');
            return err;
        }
        
        res.send(docs);
    });
}

// Parent for profile getters
var getProfile = {
    username: function(req, res) { res.send(req.doc.username) },
    name    : function(req, res) { res.send(req.doc.firstName + ' ' + req.doc.middleName + ' ' + req.doc.lastName ) },
    grade   : function(req, res) { res.send(req.doc.grade   ) },
    role    : function(req, res) { res.send(req.doc.role    ) },
    school  : function(req, res) { res.send(req.doc.school  ) },
    email   : function(req, res) { res.send(req.doc.email   ) },
    id      : function(req, res) { res.send(req.doc.id      ) },
    index   : function(req, res) { res.send('TODO:  Render profile page on profile index request')}
}

var user = {
    lookup: function(req, res) {
        var input = url.parse(req.url, true).query;
        
        var id         = input.id         ;
        var username   = input.username   ;
        var firstName  = input.firstName  ;
        var middleName = input.middleName ;
        var lastName   = input.lastName   ;
        var email      = input.email      ;
        var role       = input.role       ;
        
        var query = {};

        if (id         ) query._id        = id         ;
        if (username   ) query.username   = username   ;
        if (firstName  ) query.firstName  = firstName  ;
        if (middleName ) query.middleName = middleName ;
        if (lastName   ) query.lastName   = lastName   ;
        if (email      ) query.email      = email      ;
        if (role       ) query.role       = role       ;
        
        if (username || firstName || middleName || lastName || email || role || id) {
            userModel.find(query, function (err, docs) {
                var results = [];
                
                docs.forEach(function(element, index, array) {
                    results.push({
                        username   : element.username  ,
                        firstName  : element.firstName ,
                        middleName : element.middleName,
                        lastName   : element.lastName  ,
                        email      : element.email     ,
                        role       : element.role      ,
                        id         : element._id
                    });
                });
                res.send(results);
            });
        } else res.end();
    },
    create: function(req, res) {
        userModel.create(req.body, function(err, result) {
            if (err) {
                res.end('An error has occurred');
                return err;
            }
            
            res.send('User ' + result._id + ' created successfully');
        });
    },
    update: function(req, res) {
        userModel.findById(req.body._id, function(err, selected) {
            if (req.body.username   ) selected.username   = req.body.username   ;
            if (req.body.email      ) selected.email      = req.body.email      ;
            if (req.body.password   ) selected.password   = req.body.password   ;
            if (req.body.firstName  ) selected.fistName   = req.body.firstName  ;
            if (req.body.middleName ) selected.middleName = req.body.middleName ;
            if (req.body.lastName   ) selected.lastName   = req.body.lastName   ;
            if (req.body.school     ) selected.school     = req.body.school     ;
            if (req.body.role       ) selected.role       = req.body.role       ;
            if (req.body.grade      ) selected.grade      = req.body.grade      ;
            
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
        userModel.remove({_id: url.parse(req.url, true).query.target}, function(err) {
            if (err) {
                res.end(err);
                return true;
            }
            
            res.end('User ' + url.parse(req.url, true).query.target + ' removed successfully.');
        });
    }
}

// Find user by ID, append the result to the req for later use
function findUser(req, res, next) {
    userModel.where({ _id: req.params.id }).findOne(function(err, doc) {
        if (err) {
            res.end('An error has occured');
            return err;
        }
        
        req.doc = doc;
        next();
    });
}

// Used for finding info about the user requesting the info
function findSelf(req, res, next) {
    req.doc = req.user;
    next();
}

// Handle GET requests
router.get('/enrolled', pass.atleastStudent, getEnrolledIn );

router.get('/profile/username', pass.atleastStudent, findSelf, getProfile.username );
router.get('/profile/name'    , pass.atleastStudent, findSelf, getProfile.name     );
router.get('/profile/grade'   , pass.atleastStudent, findSelf, getProfile.grade    );
router.get('/profile/role'    , pass.atleastStudent, findSelf, getProfile.role     ); 
router.get('/profile/school'  , pass.atleastStudent, findSelf, getProfile.school   );
router.get('/profile/email'   , pass.atleastStudent, findSelf, getProfile.email    );
router.get('/profile/id'      , pass.atleastStudent, findSelf, getProfile.id       );
router.get('/profile/'        , pass.atleastStudent, findSelf, getProfile.index    );

router.get('/profile/:id/username', pass.atleastStudent, findUser, getProfile.username );
router.get('/profile/:id/name'    , pass.atleastStudent, findUser, getProfile.name     );
router.get('/profile/:id/grade'   , pass.atleastStudent, findUser, getProfile.grade    );
router.get('/profile/:id/role'    , pass.atleastStudent, findUser, getProfile.role     );
router.get('/profile/:id/school'  , pass.atleastStudent, findUser, getProfile.school   );
router.get('/profile/:id/email'   , pass.atleastStudent, findUser, getProfile.email    );
router.get('/profile/:id/id'      , pass.atleastStudent, findUser, getProfile.id       );
router.get('/profile/:id/'        , pass.atleastStudent, findUser, getProfile.index    );

router.get('/lookup', pass.atleastTeacher, user.lookup );
router.get('/remove', pass.ensureAdmin   , user.remove );

router.post('/create', pass.ensureAdmin   , user.create );
router.post('/update', pass.ensureAdmin   , user.update );

module.exports = router;