// These are the credentials that will be used for initial launch of the site.
// Feel free to change them, though it is not mandatory
var defaultUser  = 'admin'              ;
var defaultEmail = 'noreply@example.com';
var defaultPass  = 'bovine'             ;

function configure(app, db, router) {
    var configModel = db.model.config;
    
    configModel.find({}).limit(5).sort().exec(function(err, result) {
        if (err) return err;
        
        if (result.length > 0) {
            console.log(result.length + ' or more configuration entries found.  Using latest...');
            launch(app, db, router, result[0]);
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
                if (err) return err;
                
                configure(app, db, router);
            });
        }
    });
}

function launch(app, db, router, config) {
    if (process.argv.length > 2) {
        process.argv.forEach(function(element, index, array) {
            switch(element) {
                case '-p':
                case '--p':
                case '--port':
                    config.port = array[index+1];
                    break;
                case '-h':
                case '--h':
                case '--host':
                    config.hostname = array[index+1];
                    break;
                case '-e':
                case '--e':
                case '--env':
                    config.environment = array[index+1];
                    break;
            }
            if (index == array.length - 1) listen();
        });
    } else listen();
    
    function listen() {
        findAdmin();
        
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
                default:
                    // may be changed later
                    mode = 'development';
                    break;
            }
            console.log('bovine started on port ' + port + ' in ' + mode + ' mode');
        });
    }
    
    function findAdmin() {
        var userModel = db.model.user;
        
        userModel.find({role: 4}).limit(1).exec(function(err, result) {
            if (err) return err;
            
            if (result.length == 0) {
                userModel.create({
                    username : defaultUser ,
                    email    : defaultEmail,
                    password : defaultPass ,
                    role     : 4
                }, function(err, result) {
                    if (err) return err;
                    
                    console.log('NO ADMIN FOUND');
                    console.log('Creating new admin account...');
                    console.log('');
                    console.log('Default admin credentials are provided below.  Please change after login');
                    console.log('');
                    console.log('USER:  ' + defaultUser);
                    console.log('PASS:  ' + defaultPass);
                });
            }
        });
    }
}

module.exports = configure;