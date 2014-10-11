var ym = require("./../ym-sdk");

exports.index = function(req, res){
    if (req.session.ssid === undefined) {
        req.session.ssid = Date.now();
    }
    
    if (req.session.auth_code !== undefined) {
        ym.getOperationsHistory(req.session.token, 3, function(body) {
            console.log('body: ' + JSON.stringify(body));
        });
        
        return res.render('authorized', {
            auth_code: req.session.auth_code, 
            token: req.session.token,
            layout: false
        });
    } else {
        return res.render('index', { layout: false })
    }
};

exports.payment = function(req, res, next) {
    
}

exports.ymAuthResult = function(req, res, next) {
    if (req.param('error') !== undefined) {
        
    }
    
    var ymAuthCode = req.param('code');
    req.session.auth_code = ymAuthCode;
    
    ym.authTokenRequest(ymAuthCode, function(token) {
        if (token !== undefined) {
            req.session.token = token;   
        }
        
        res.redirect('/');
    });
}