var express = require('express');
var passport = require('passport');

// middleware
var logger = require('morgan');
var multer = require('multer');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var session = require('express-session');

// jade == express.called
var stylus = require('stylus');
var nib = require('nib');

var db = require('./config/dbschema');
var pass = require('./config/pass');

var basic_routes = require('./routes/basic');
var user_routes = require('./routes/user');
var admin_routes = require('./routes/admin');

var app = express();

function compile(str, path) {
    return stylus(str).set('filename', path).use(nib())
}

app.set('views', __dirname + '/views');
app.locals.basedir = app.get('views');
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({
    secret: 'snughtiwswoc',
    saveUninitialized: false,
    resave: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(stylus.middleware({
    src: __dirname + '/static',
    compile: compile
}));
app.use(express.static(__dirname + '/static'));

app.get('/', basic_routes.index);
app.get('/account', pass.ensureAuthenticated, user_routes.account);
app.get('/login', user_routes.getlogin);
app.post('/login', user_routes.postlogin);
app.get('/logout', user_routes.logout);
app.get('/dashboard', user_routes.dashboard);
app.post('/admin/user/create', pass.ensureAuthenticated, pass.ensureAdmin, admin_routes.user.create);
app.post('/admin/user/update', pass.ensureAuthenticated, pass.ensureAdmin, admin_routes.user.update);
app.get('/admin/lookup', pass.ensureAuthenticated, pass.ensureAdmin, admin_routes.lookup);
app.get('/admin/user/edit', pass.ensureAuthenticated, pass.ensureAdmin, admin_routes.user.edit);
app.get('/admin/user/remove', pass.ensureAuthenticated, pass.ensureAdmin, admin_routes.user.remove);

app.listen(9500, function(){
    console.log('Express server listening on port 9500');
});