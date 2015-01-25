var router = require('express').Router();
var pass   = require('../util/pass');
var url    = require('url');

var configModel = require('../util/dbschema').model.config;

var config = {
    create : function(req, res) {
        configModel.create(req.body, function(err, result) {
            if (err) {
                res.end('An error has occured');
                return err;
            }
            
            // NOTICE:  Configurations currently are not designed to take effect
            // until restart.  Reload functionality will be added later.
            res.send('Configuration model ' + result._id + ' successfully created');
        });
    },
    lookup : function(req, res) {
        configModel.find({}).sort(-1).limit(25).exec(function(err, docs) {
            res.send(docs);
        });
    },
    info : function(req, res) {
        configModel.findById(req.body._id, function(err, doc) {
            res.send(doc);
        });
    }
}

router.post('/config/create', pass.ensureAdmin, config.create );

router.get('/config/lookup', pass.ensureAdmin, config.lookup );
router.get('/config/remove', pass.ensureAdmin, config.remove );
router.get('/config/info'  , pass.ensureAdmin, config.info   );

// These routes are deactivated due to the versioning system.  Upon altering a
// configuation model, changes are submitted as an entirely new model.  This is
// subject to change later down the road,
//router.post('/config/update', pass.ensureAdmin, config.update );
//router.get('/config/remove', pass.ensureAdmin, config.remove );

module.exports = router;