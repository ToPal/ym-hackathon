"use strict"

var request = require("request");

var client_id = '8BED8D8E7C744179D710516ED284B1C06D396FEBED52710A2E63A249526F0B11';
var client_secret = '7C2B97B537EE5148C826D49621104B4414CAF7A64975A003AB102BF930E323779F58E40E201B2035BEFED2F500E4C838773BE6B5642E03D4B3288819A22C03E6';
var redirect_uri = 'http://spbhack.ru/ym';

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