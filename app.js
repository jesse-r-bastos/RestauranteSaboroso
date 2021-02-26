var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var formidable = require('formidable');
var http = require('http');
var socket = require('socket.io');
var path = require('path');

var app = express();
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));

var http = http.Server(app);    // Using Socket.io
var io = socket(http);

io.on('connection', function(socket){

  console.log('Novo Usuário Conectado !!');

  io.emit('reservations update', {
    date: new Date()
  });

});
const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redisClient = redis.createClient();
var indexRouter = require('./routes/index')(io);
var adminRouter = require('./routes/admin')(io);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
// Using Formidable

app.use(function(req, res, next){

  req.body = {};

  //if ( (req.method === 'POST')  && (req.path !== '/admin/login') ) {
  if ( req.method === 'POST') {

      var form = formidable.IncomingForm({
        uploadDir: path.join(__dirname, "/public/images"),
        keepExtensions:true
    });

    form.parse(req, function (err, fields, files) {

      req.body = fields;
      req.fields = fields;
      req.files = files;

      next();

    });

  } else {

    next();

  }

});

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'p@ssw0rd',
    resave: true,
    saveUninitialized:true
  })
)
// --------------------------------------------
app.use(logger('dev'));
//app.use(express.urlencoded({ extended: false }));  // -socket.io
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);

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

http.listen(3000, function(){

  console.log('... Servidor em Execução .... at:', Date() );

});

//module.exports = app; // -socket.io
