var passport    = require('passport');
var mongo       = require("./mongo");
var Strategy    = require('passport-local').Strategy;


module.exports  = function(){
    //require('./strategies/local')();

    passport.use(new Strategy(
    function(username, password, cb) {
        mongo.users.findByUsername(username, function(err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        if (user.password != password) { return cb(null, false); }
        return cb(null, user);
        });
    }));

};