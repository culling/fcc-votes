var passport    = require('passport');
var mongo       = require("./mongo");
require('./strategies/local')();

passport.serializeUser(function(user, cb) {
    console.log("serializedUser called");        
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    console.log("deserializedUser called");        
    mongo.users.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});

module.exports = passport;