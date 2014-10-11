var orm  = require("orm")
  , util = require("util")

function getMysqlConnectionString() {
  var login  = "tomsha_ymhack";
  var pass   = "qwerty123";
  var host   = "deli.beget.ru";
  var dbName = "tomsha_ymhack";
  
  return util.format("mysql://%s:%s@%s/%s", login, pass, host, dbName);
}

function initDB(name, columns) {
  var connectString = getMysqlConnectionString();
  
  return orm.express(connectString, {
      define: function (db, models, next) {
          models[name] = db.define(name, columns);
          return next();
      }
  });
}

function initUsersDB() {
  return initDB("user", {
    id: Number,
    name: String,
    pass: String
  });
}

exports.initUsersDB = initUsersDB;