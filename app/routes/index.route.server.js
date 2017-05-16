const url           = require("url");
const querystring   = require('querystring');

//Express and set up router
var express         = require('express');
var router          = express.Router();

//Configs and Modules
var config      = require("./../../config/config");
var mongoExport = require("./../../config/mongo");


router.get("/", function(req, res){
    //res.write("API Query");
    //res.write("Guide to API");
    //res.write('<a href=/')
    //res.end();
    //res.sendFile(("apiguide.html"), {root: "public"});

    res.render("index", {"title": "Hello World", "user": "User 1" } );
});

module.exports = router;