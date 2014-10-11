"use strict"

module.exports = function(req, res, next) {
  if (req.session.ssid === undefined) {
    req.session.ssid = Date.now();
  }
  
  req.session.isAuth = function() {
    return (req.session.userid !== undefined);
  }
  
  return next();
}