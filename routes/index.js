var ym = require("./../ym-sdk");
var yandexMoney = require("yandex-money-sdk");

exports.index = function(req, res) {
    return res.render('index', { layout: false })
};

exports.payment = function(req, res, next) {
    
}

exports.register = function(req, res, next) {
    if (req.session.isAuth()) {
        return res.redirect('/');
    }
    
    if ((req.param('name') !== undefined) && (req.param('pass') !== undefined)) {
        return req.models.user.create({
            name: req.param('name'),
            pass: req.param('pass')
        }, function(err, result) {
            if (err) { 
                console.log(err);
                return res.redirect('/register');
            }
            
            req.session.userid = result.id;
            req.session.user = result;
            return res.redirect('/');
        });
    }
    
    return res.render('register', {layout: false})
}

exports.ymAuthResult = function(req, res, next) {
    if (req.param('error') !== undefined) {
        console.log(req.param('error'));
    }
    
    var ymAuthCode = req.param('code');
    req.session.auth_code = ymAuthCode;
    
    return ym.authTokenRequest(ymAuthCode, function(token) {
        if (token !== undefined) {
            req.session.token = token;   
        }
        
        if (req.session.seller !== undefined) {
            var api = new yandexMoney.Wallet(token);
            //make request payment and process it
            console.log('price: ' + req.session.seller.price);
            var options = {
                "pattern_id": "p2p",
                "to": req.session.seller.account,
                "amount_due": req.session.seller.price,
                "contract": req.session.contract,
                "comment": "order: " + req.session.contract,
                "message": "order: " + req.session.contract,
                "label": "testPayment"
            };
            api.requestPayment(options, function requestComplete(err, data) {
                if(err) {
                    return console.log(err);
                }
                if(data.status !== "success") {
                    return console.log(data);
                }
                var request_id = data.request_id;
            
                api.processPayment({
                    "request_id": request_id
                    }, processComplete);
            });
            
            function processComplete(err, data) {
                if(err) {
                    return console.log(err);
                }
                console.log('success payment: ' + JSON.stringify(data));
            }
        }
        
        res.redirect('/');
    });
}