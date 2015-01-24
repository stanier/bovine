var router = require('express').Router();
var pass   = require('../config/pass');

var url         = require('url');

var userModel   = require('../config/dbschema').model.user  ;
var classModel  = require('../config/dbschema').model.class ;
var schoolModel = require('../config/dbschema').model.school;

var student = {
    lookup: function(req, res) {
        
    },
    list: function(req, res) {
        
    }
}

router.get('/lookup', student.lookup);
router.get('/list'  , student.list  );

module.exports = router;