const url           = require("url");
const querystring   = require('querystring');

//Express and set up router
var express         = require('express');
var router          = express.Router();

//Configs and Modules
var config      = require("./../../config/config");
var mongoExport = require("./../../config/mongo");

var passport    = require("passport");
//var passport    = require('./../../config/passport') ;
//var users       = require("./../controllers/user.controller.server");



router.get("/", function(req, res){
    res.render("index", {"title": "Hello World", "user": req.user } );
});

router.get('/login',
  function(req, res){
    res.render('login');
  });
  
router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
  
router.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

router.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

module.exports = router;