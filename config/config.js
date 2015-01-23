function configure(app, db, router) {
    var configModel = db.model.config;
    
    configModel.find({}).limit(5).sort().exec(function(err, result) {
        if (err) { return err }
        
        if (result.length > 0) {
            console.log(result.length + ' or more configuration entries found.  Using latest...');
            launch(app, router, result[0]);
        } else {
            console.log('No configuration entry detected.  Creating one now...');
            configModel.create({
                public      : true         ,
                hostname    : '0.0.0.0'    ,
                port        : 80           ,
                codes       : false        ,
                environment : 1
                // 0 == production
                // 1 == development
                // 2 == testing
            }, function(err, result) {
                if (err) { return err }
                
                configure(app, db, router);
            });
        }
    });
}

function launch(app, router, config) {
    if (process.argv.length > 2) {
        process.argv.forEach(function(e, i, a) {
            switch(e) {
                case '-p':
                case '--port':
                    config.port = a[i+1];
                    break;
                case '-h':
                case '--host':
                    config.hostname = a[i+1];
                    break;
                case '-e':
                case '--env':
                    config.environment = a[i+1];
                    break;
            }
            if (i == a.length - 1) listen();
        });
    } else {
        listen();
    }
    function listen() {
        app.listen(config.port, function() {
            var mode = '';

            switch(config.environment) {
                case 0:
                    mode = 'production';
                    break;
                case 1:
                    mode = 'development';
                    break;
                case 2:
                    mode = 'testing';
                    break;
            }
            console.log('bovine started on port ' + port + ' in ' + mode + ' mode');
        });
    }
}

module.exports = configure;