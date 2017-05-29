const url           = require("url");
const querystring   = require('querystring');

//Express and set up router
var express         = require('express');
var router          = express.Router();

//Configs and Modules
var config      = require("./../../config/config");
var mongoExport = require("./../../config/mongo");

var passport    = require("passport");
var users       = require("./../controllers/user.controller.server");

router.get("/", function(req, res){
    res.render('polls/polls', {title: config.pageTitle,  "user": req.user })
});

router.get("/new",
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
    res.render('polls/polls-new', {title: config.pageTitle,  "user": req.user })
});

router.get("/user", function(req, res){
    //let username = req.user.username;
    res.render('polls/polls-user', {title: config.pageTitle,  "user": req.user })

});


router.get("/:id", function(req, res){
    console.log(req.params.id);
    res.render('polls/polls-findOne', {title: config.pageTitle,  "user": req.user, "pollId": req.params.id })
});


module.exports = router