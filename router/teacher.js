var router = require('express').Router();
var pass   = require('../config/pass');

var url         = require('url');

var userModel   = require('../config/dbschema').model.user  ;
var classModel  = require('../config/dbschema').model.class ;
var schoolModel = require('../config/dbschema').model.school;

var teacher = {
    lookup: function(req, res) {
        
    },
    list: function(req, res) {
        
    }
}

router.get('/lookup', teacher.lookup);
router.get('/list'  , teacher.list  );

module.exports = router;