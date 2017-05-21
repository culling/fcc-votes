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



var samplePollsObjects= [
{id: 1,
    meeting: "Fruits of the World Conference",
    date: new Date,
    question:"What is the best way to eat a mango?", 
    responseOptions:["on it's own", "in a smoothy", "whole"], 
    votes:[{"username":"jim",           "voteChoice":0},
            {"username":"jack",         "voteChoice":1},
            {"username":"jill",         "voteChoice":1}
    ] ,
    votingOpen:false },
{id: 2,
    meeting: "Vegetables of the World Conference",
    date: new Date,
    question:"Is the tomato a vegetable?", 
    responseOptions:["yes", "no", "whole"], 
    votes:[{"username":"jim",           "voteChoice":1},
            {"username":"jack",         "voteChoice":1},
            {"username":"jill",         "voteChoice":1},
            {"username":"King Arthur",  "voteChoice":0}  ] ,
    votingOpen:false }
    ]


router.get("/", function(req, res){
    //res.write("API Query");
    //res.write("Guide to API");
    //res.write('<a href=/')
    //res.end();
    res.sendFile(("apiguide.html"), {root: "public"});
});

router.get("/polls", function(req, res){
    res.send(samplePollsObjects);
});



router.post("/polls/new", function(req, res){
    console.log(req.body);
    /*
    res.write("submittd");
    res.end();
    */
    res.send(req.body);
});

/*
router.post("/images/new", function(req, res){
    var body = req.body;
    var newDoc = {
        "url":      body.url,
        "alt-text": body["alt-text"],
        "original-page": body["original-page"],
        "submitted": new Date()
    }
    mongoExport.image.create(newDoc, function(err, returnedDocument){
        if(err){console.error(err)}
        console.log(returnedDocument);
    });
    res.end("submitted");
});

//Allowing for the query to be modified as a get request
router.get("/images/search/new", function(req, res){
    var reqQuery    = querystring.parse(url.parse(req.url).query);
    var searchText  = reqQuery["search-text"];
    var offset      = reqQuery["offset"] || 0;
    console.log("offset: " + offset);
    
    var newDoc = {
        "search-text": searchText,
        "submitted": new Date()
    }
    mongoExport.search.create(newDoc, function(err, returnedDocument){
        if(err){console.error(err)}
        console.log(returnedDocument);
    });

    mongoExport.image.retrieve( searchText , offset, function(foundDocs ){
        foundDocs.forEach(function(foundDoc){
            //console.log(foundDoc);
            res.write(JSON.stringify(foundDoc) + "\n");
        });
        //res.write( JSON.stringify(req.body));
        res.end();
    }); 
    
});

router.get("/images/search", function(req, res){
    var reqQuery    = querystring.parse(url.parse(req.url).query);
    //var searchText  = reqQuery["search-text"];
    var offset      = reqQuery["offset"] || 0;
    //console.log("offset: " + offset);


    
    mongoExport.search.retrieve( offset, function(foundDocs ){
        foundDocs.forEach(function(foundDoc){
            //console.log(foundDoc);
            res.write(JSON.stringify(foundDoc) + "\n");
        });
        //res.write( JSON.stringify(req.body));
        res.end();
    }); 
    
});
*/

module.exports = router;