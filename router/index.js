module.exports = function (app) {
    app.use('/admin', require('./admin'));
    app.use('/manager', require('./manager'));
    app.use('/teacher', require('./teacher'));
    app.use('/user', require('./user'));
    app.use('/', require('./basic'));
};