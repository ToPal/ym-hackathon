"use strict"

var request = require("request");

var client_id = '3C8EB4377C987BA354A59F09A066375AEF4203E02EEDBFFB5B527EF99D1D7606';
var client_secret = 'A12B4FE5834DCA01BAE08509AB79FDC36E8A18248B4E56573BA93FEEC5CEF13A59BD64CF837141E04229CD507ADAE21506B80939BAB4CD6934597F0B5FEDEA8E';
var redirect_uri = 'http://portion.cloudapp.net:8080/ym-result';

module.exports.authTokenRequest = function(auth_code, callback) {
    request.post('https://sp-money.yandex.ru/oauth/token', {form: {
      code: auth_code,
      client_id: client_id,
      grant_type: 'authorization_code',
      redirect_uri: redirect_uri,
      client_secret: client_secret
    }}, function(error, response, body) {
      if (error) {
        return console.log(error);
      }
      
      var jBody = JSON.parse(body);
      
      return callback(jBody.access_token);
    });
}

function apiPOST(functionName, token, params, callback) {
    var address = 'https://money.yandex.ru/api/' + functionName;
    var auth = 'Bearer ' + token;
    
    request.post(address, {
      headers: {Authorization: auth}, 
      form: params
      }, function(error, response, body) {
        if (error) {
          console.log(error);
        }
        
        return callback(error, response, body);
    });
}

module.exports.getOperationsHistory = function(token, recordsCount, callback) {
    return apiPOST('operation-history', token, {
        records: recordsCount
    }, function(error, response, body) {
        if (error) {
          console.log(error);
        }
        
        var jBody = JSON.parse(body);
        
        return callback(jBody);
    });
}

module.exports.client_id = client_id;