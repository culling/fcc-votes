var passport    = require('passport');
var mongo       = require("./mongo");
require('./strategies/local')();

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


module.exports = passport;