var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors'); // For cross request

const corsOptions = {
  origin: [
    'https://no-2c.netlify.app',
    'http://localhost:5500', //TODO DElETE WHEN DEPLOY!!!!!
    '127.0.0.1:5500' //TODO DElETE WHEN DEPLOY!!!!!
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
};

var indexRouter = require('./routes/index');
var aiCamRouter = require('./routes/aiCam');
var usersRouter = require('./routes/users');
var aboutUsRouter = require('./routes/aboutUs');

var app = express();
app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({  limit: '50mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/index', indexRouter);
app.use('/aicam', aiCamRouter);
app.use('/users', usersRouter);
app.use('/aboutUs', aboutUsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
