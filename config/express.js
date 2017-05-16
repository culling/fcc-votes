var config      = require("./config");
var http        = require('http');
var express     = require("express");
var app         = express();

module.exports = function(){
var server  = http.createServer(app);
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

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