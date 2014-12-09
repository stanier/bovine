module.exports = function (app) {
    app.use('/admin'  , require('./admin'  ));
    app.use('/manager', require('./manager'));
    app.use('/teacher', require('./teacher'));
    app.use('/student', require('./student'));
    app.use('/user'   , require('./user'   ));
    app.use('/class'  , require('./classes'));
    app.use('/school' , require('./school' ));
    app.use('/'       , require('./basic'  ));
};