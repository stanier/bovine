var express  = require('express');
var passport = require('passport');

// middleware
var logger         = require('morgan');
var multer         = require('multer');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var methodOverride = require('method-override');
var session        = require('express-session');
var mongoStore     = require('connect-mongo')(session);
var flash          = require('connect-flash');

// Call the compilers
var stylus = require('stylus');
var nib    = require('nib');

var db   = require('./config/dbschema');
var pass = require('./config/pass');

var port = 8080;
var app  = express();

function compile(str, path) { return stylus(str).set('filename', path).use(nib()) }

if      (app.get('env') == 'production'     ) port = 80;
else if (app.get('env') == 'development'    ) port = 9500;
else                                          port = 9501;

// Declare the dynamic view directory 
app.set('views', __dirname + '/views');
app.locals.basedir = app.get('views');
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({
    secret:            'snughtiwswoc',
    resave:            false,
    saveUninitialized: false,
    store: new mongoStore({
        db: 'bovineSessions',
        host: 'localhost'
    })
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(stylus.middleware({
    src: __dirname + '/static',
    compile: compile
}));
app.use(express.static(__dirname + '/static'));

var router = require('./router')(app);

app.listen(port, function(){
    var mode = '';
    if (app.get('env') == 'development') mode = ' in development mode'
    console.log('bovine started on port ' + port + mode);
});