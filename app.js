"use strict"
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.register('.html', require("ejs"));
  app.set('view engine', 'html');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "session secret" }));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.use("/less", express.static(__dirname + '/views/less'));
app.use("/js", express.static(__dirname + '/views/js'));
app.use("/img", express.static(__dirname + '/views/img'));

// страница для получателей платежей
app.get('/', routes.index);
// страница для плательщиков
app.get('/payment', routes.payment);
// страница для обработки результатов платежа
app.get('/ym-result', routes.ymAuthResult)

app.listen(8080, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
