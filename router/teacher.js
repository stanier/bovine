var express = require('express');
var router = express.Router();
var pass = require('../config/pass');
var classModel = require('../config/dbschema').model.class;

function listClasses(req, res) {
    // TODO:  code function for getting class list
    classModel.find({teacher: req.user._id}, function(err, docs) {
        res.send(docs);
    });
};

router.get('/classes/list', pass.ensureTeacher, listClasses);

module.exports = router;