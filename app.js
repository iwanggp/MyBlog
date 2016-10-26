var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var session = require('express-session'); //只有通过这种方式才能使用Session
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings');
var flash = require('connect-flash');
var routes = require('./routes/index'); //将路由的文件夹添加到路由目录中
var users = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); //设置视图引擎为ejs
// app.engine('.html', require('ejs ').__express);
    // app.set('view engine', 'html');

app.use(partials()); //增加片段视图
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //设置静态文件服务器
app.use(flash());
//将Session保存到mongodb数据库中
app.use(session({
    secret: settings.cookieSecret,
    store: new MongoStore({
        // db: settings.db
        url: 'mongodb://222.22.64.80/' + settings.db, //只有通过这种方式，才能连接成功
        autoRemove: 'native'
    })
}));
app.use(function(req, res, next) {
    console.log("app.usr local");
    // res.locals.user = req.session.user;
    // res.locals.post = req.session.post;
    var error = req.flash('error');
    res.locals.error = error.length ? error : null;

    var success = req.flash('success');
    res.locals.success = success.length ? success : null;
    next();
});
app.use('/', routes);
app.listen(9925); //设置监听端口
console.log("something happening");
// app.use('/users', users.list);
/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
