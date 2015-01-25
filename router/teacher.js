var router = require('express').Router();
var pass   = require('../util/pass');

var url         = require('url');

var userModel   = require('../util/dbschema').model.user  ;
var classModel  = require('../util/dbschema').model.class ;
var schoolModel = require('../util/dbschema').model.school;

var teacher = {
    lookup: function(req, res) {
        
    },
    list: function(req, res) {
        
    }
}

router.get('/lookup', teacher.lookup);
router.get('/list'  , teacher.list  );

module.exports = router;