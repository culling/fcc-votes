var config      = require("./config");
var http        = require('http');
var express     = require("express");
var cookieParser    = require('cookie-parser');
var expressSession  = require('express-session');
//var passport    = require("./passport");
var app         = express();


var passport    = require('passport');
var mongo       = require("./mongo");
var Strategy    = require('passport-local').Strategy;


module.exports = function(){
    var server  = http.createServer(app);
    var bodyParser = require("body-parser");
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(expressSession({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

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

    app.use(passport.initialize());
    app.use(passport.session());

//Views
app.set("views", "./app/views");
app.set("view engine", "ejs");

var api = require("./../app/routes/api.route.server");
app.use("/api", api);

var index = require("./../app/routes/index.route.server");
app.use("/", index);

//static files
app.use(express.static('./public'));

return server;
}