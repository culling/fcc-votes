var passport        =   require('passport');
var LocalStrategy   =   require('passport-local').Strategy;
var mongo           =   require("./../mongo");

module.exports = function(){
    passport.use(new LocalStrategy(
    function(username, password, cb) {
        console.log("local strategy called");
        mongo.users.findByUsername(username, function(err, user) {
        console.log(user);
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        if (user.password != password) { return cb(null, false); }
        return cb(null, user);
        });
    }));

};