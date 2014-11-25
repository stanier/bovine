var express = require('express');
var router = express.Router();
var pass = require('../config/pass');

var passport = require('passport');

function getEnrolled(req, res) {
    // TODO:  Get enrolled for user via classes.find(req.user._id)
    res.send('It works!');
}

router.get('/enrolled', pass.atleastStudent, getEnrolled);

module.exports = router;