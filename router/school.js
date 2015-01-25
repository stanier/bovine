var router = require('express').Router();
var pass   = require('../util/pass');

var url = require('url');

var schoolModel = require('../util/dbschema').model.school;

var school = {
    lookup: function(req, res) {
        var input = url.parse(req.url, true).query;
        
        var id   = input.id   ;
        var name = input.name ;
        var type = input.type ;
        
        var query = {};

        if (id   ) query._id  = id   ;
        if (name ) query.name = name ;
        if (type ) query.type = type ;
        
        if (id || name || type) {
            schoolModel.find(query, function (err, docs) {
                var results = [];
                docs.forEach(function(element, index, array) {
                    results.push({
                        name     : element.name     ,
                        type     : element.type     ,
                        website  : element.website  ,
                        zipcode  : element.zipcode  ,
                        district : element.district ,
                        city     : element.city     ,
                        state    : element.state    ,
                        country  : element.country  ,
                        id       : element._id
                    });
                    if (index == array.length - 1) res.send(results);
                });
            });
        } else res.end();
    },
    create: function(req, res) {
        schoolModel.create(req.body, function(err, result) {
            if (err) {
                res.end('An error has occurred');
                return err;
            }
            res.send('School ' + result._id + ' created successfully');
        });
    },
    update: function(req, res) {
        schoolModel.findById(req.body._id, function(err, selected) {
            if (req.body.name) selected.name = req.body.name ;
            if (req.body.type) selected.type = req.body.type ;
            selected.save(function (err) {
                if (err) {
                    res.end('An error occurred');
                    return err;
                }
                console.log('School ' + req.body._id + ' updated successfully');
                res.end('School updated successfully');
            });
        });
    },
    remove: function(req, res) {
        schoolModel.remove({_id: url.parse(req.url, true).query.target}, function(err) {
            if (err) {
                res.end(err);
                return true;
            }
            res.end('School ' + url.parse(req.url, true).query.target + ' removed successfully.');
        });
    }
}

router.get('/lookup' , pass.ensureAdmin, school.lookup );
router.get('/remove' , pass.ensureAdmin, school.remove );

router.post('/create', pass.ensureAdmin, school.create );
router.post('/update', pass.ensureAdmin, school.update );

module.exports = router;