var router = require('express').Router();
var pass   = require('../util/pass');

var url         = require('url');

var userModel   = require('../util/dbschema').model.user  ;
var classModel  = require('../util/dbschema').model.class ;
var schoolModel = require('../util/dbschema').model.school;

var student = {
    lookup: function(req, res) {
        
    },
    list: function(req, res) {
        
    }
}

router.get('/lookup', student.lookup);
router.get('/list'  , student.list  );

module.exports = router;