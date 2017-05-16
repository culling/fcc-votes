/*
Free Code Camp: Votes

*/
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config  = require("./config/config.js");
var passport    = require('./config/passport');
var express = require("./config/express");
passport();
var app = express();
//var mongo = require("./config/mongo");


app.listen(config.port, function(){
    console.log("listening on port: " + config.port );
});
