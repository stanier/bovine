var router = require('express').Router();
var pass   = require('../util/pass');

var url = require('url');

var districtModel = require('../util/dbschema').model.districts;

var district = {
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
            districtModel.find(query, function (err, docs) {
                var results = [];
                docs.forEach(function(element, index, array) {
                    results.push({
                        name    : element.name    ,
                        website : element.website ,
                        zipcode : element.zipcode ,
                        city    : element.city    ,
                        state   : element.state   ,
                        country : element.country ,
                        id      : element._id
                    });
                });
                
                res.send(results);
            });
        } else res.end();
    },
    create: function(req, res) {
        districtModel.create(req.body, function(err, result) {
            if (err) {
                res.end('An error has occurred');
                return err;
            }
            res.send('District ' + result._id + ' created successfully');
        });
    },
    update: function(req, res) {
        districtModel.findById(req.body._id, function(err, selected) {
            if (req.body.name) selected.name = req.body.name ;
            if (req.body.type) selected.type = req.body.type ;
            
            selected.save(function (err) {
                if (err) {
                    res.end('An error occurred');
                    return err;
                }
                
                console.log('District ' + req.body._id + ' updated successfully');
                res.end('District updated successfully');
            });
        });
    },
    remove: function(req, res) {
        districtModel.remove({_id: url.parse(req.url, true).query.target}, function(err) {
            if (err) {
                res.end(err);
                return true;
            }
            res.end('District ' + url.parse(req.url, true).query.target + ' removed successfully.');
        });
    }
}

router.get('/lookup', pass.ensureAdmin, district.lookup );
router.get('/remove', pass.ensureAdmin, district.remove );

router.post('/create', pass.ensureAdmin, district.create );
router.post('/update', pass.ensureAdmin, district.update );

module.exports = router;