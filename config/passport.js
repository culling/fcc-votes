var passport    = require('passport');


module.exports  = function(){
    

    passport.serializeUser(function(user, done){
        done(null, user.id);
    } );

    passport.deserializeUser(function(id, done){
        User.findOne({
            _id:    id
        }, '-password -salt', function (err, user){
            done(err, user);
        } );
    } );

require('./strategies/local')();
};