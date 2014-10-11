var ym = require("./../ym-sdk");

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