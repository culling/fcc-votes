var passport    = require('passport');
var mongo       = require("./mongo");
var Strategy    = require('passport-local').Strategy;


module.exports  = function(){
    //require('./strategies/local')();

    passport.use(new Strategy(
    function(username, password, cb) {
        console.log("local strategy called");
        mongo.users.findByUsername(username, function(err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        if (user.password != password) { return cb(null, false); }
        return cb(null, user);
        });
    }));

    passport.serializeUser(function(user, cb) {
        console.log("serializedUser called");        
        cb(null, user.id);
    });

    passport.deserializeUser(function(id, cb) {
        console.log("deserializedUser called");        
        db.users.findById(id, function (err, user) {
            if (err) { return cb(err); }
            cb(null, user);
        });
    });

//    return passport;
};