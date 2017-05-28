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

router.get("/polls/:id", function(req, res){
    res.render('polls/findOne', {title: config.pageTitle,  "user": req.user, "pollId": req.params.id })
});

router.get("/new", function(req, res){
    res.render('polls/newPoll', {title: config.pageTitle,  "user": req.user })
});

router.get("/user", function(req, res){
    //let username = req.user.username;
    res.render('polls/polls-user', {title: config.pageTitle,  "user": req.user })

});

module.exports = router