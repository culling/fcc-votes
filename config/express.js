//Settings
var config      = require("./config");
var passport    = require("./passport");
var mongo       = require("./mongo");

//Modules
var http        = require('http');
var express     = require("express");
var cookieParser    = require('cookie-parser');
var expressSession  = require('express-session');
var flash       = require("connect-flash");


//express app
var app         = express();


module.exports = function(){
    var server  = http.createServer(app);
    var bodyParser = require("body-parser");
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(expressSession({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

    //Passport    
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    //Views
    app.set("views", "./app/views");
    app.set("view engine", "ejs");

    //Routes
    var api = require("./../app/routes/api.route.server");
    app.use("/api", api);

    var polls = require("./../app/routes/polls.route.server");
    app.use("/polls", polls);

    var index = require("./../app/routes/index.route.server");
    app.use("/", index);




    //static files
    app.use(express.static('./public'));

    return server;
}