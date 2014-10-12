"use strict"
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , models = require("./models");

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
app.use("/fonts", express.static(__dirname + '/views/fonts'));

app.get('/*', require("./sessions"));
app.post('/*', require("./sessions"));

// страница для получения списка продуктов
app.get('/', routes.index);
// страница для плательщиков
app.get('/payment', routes.payment);
// регистрация
app.get('/register', models.initUsersDB(),  routes.register);
app.post('/register', models.initUsersDB(),  routes.register);
// страница для обработки результатов платежа
app.get('/ym', routes.ymAuthResult);

app.post('/getSellers', function(req, res, next) {
  var products = req.param('products');
  if (products === undefined) {
    return res.json({ result: 'fail', errorMessage: 'request must consist of products' })
  }
  
  var contract = [];
  for (var i in products) {
    contract.push(products[i].id + '(' + Math.floor(products[i].weight) + ')');
  }
  
  var sellers = [{
      id: 1,
      name: "Пятерочка",
      address: "Пискаревский проспект, 18",
      price: 657,
      account: 410011364527464
    }, {
      id: 2,
      name: "Ламантин",
      address: 'Пискаревский проспект, д.2к"Щ"',
      price: 763,
      account: 410011364527464
    }, {
      id: 3,
      name: "Casual Cafe",
      address: 'Пискаревский проспект, д.2к"Щ"',
      price: 698,
      account: 410011364527464
    }];
    
  req.session.sellers = sellers;
  req.session.contract = contract.join(',');
    
  return res.json({
    result: 'ok',
    sellers: sellers
  });
});

app.post('/selectSeller', function(req, res, next) {
  if (req.param('id')) {
    if (req.session.seller !== undefined) {
      delete req.session.seller;
    }
    
    var sellerId = req.param('id');
    
    for (var i in req.session.sellers) {
      if (req.session.sellers[i].id == sellerId) {
        req.session.seller = req.session.sellers[i];
        req.session.sellers = undefined;
        break;
      }
    }
    
    if (req.session.seller === undefined) {
      return res.json({ result: 'fail', errorMessage: 'bad seller id' });
    }
    
    return res.json({ result: 'ok' });
  }
  
  return res.json({ result: 'fail', errorMessage: 'need seller id' });
});

app.listen(8080, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
