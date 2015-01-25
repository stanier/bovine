var router = require('express').Router();
var pass   = require('../util/pass');

var url         = require('url');

var userModel   = require('../util/dbschema').model.user  ;
var classModel  = require('../util/dbschema').model.class ;
var schoolModel = require('../util/dbschema').model.school;

var manager = {
    lookup: function(req, res) {
        
    },
    list: function(req, res) {
        
    }
}

router.get('/lookup', manager.lookup);
router.get('/list'  , manager.list  );

module.exports = router;