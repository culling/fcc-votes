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
var polls       = require("./../controllers/polls.controller.server");





router.get("/", function(req, res){
    //res.write("API Query");
    //res.write("Guide to API");
    //res.write('<a href=/')
    //res.end();
    res.sendFile(("apiguide.html"), {root: "public"});
});

router.get("/polls", function(req, res){
    mongoExport.polls.retrieve(null, function(foundDocs){
        res.send(foundDocs);
    })
});

router.get("/meetings", function(req, res){
    mongoExport.polls.retrieveMeetings(null, function(foundDocs){
        res.send(foundDocs);
    })
});

router.get("/message", function(req, res){
    console.log("called - get");
    //polls.statusChange() ;
});
router.post("/message", function(req, res){
    console.log("called - post");
    //polls.statusChange() ;
});
router.put("/message", function(req, res){
    console.log("called - put");
    //console.log(req);
});

router.post("/polls/new", function(req, res){
    function listAllProperties(o) {
        var objectToInspect;     
        var result = [];
        
        for(objectToInspect = o; objectToInspect !== null; objectToInspect = Object.getPrototypeOf(objectToInspect)) {  
        result = result.concat(Object.getOwnPropertyNames(objectToInspect));  
        }
	
	    return result; 
    }

    var props =  listAllProperties(req.body);
    console.log(props);
    var poll = JSON.parse(props[0] );


    //console.log(req.body);
    mongoExport.polls.create(poll, function(res){
        
    } );
});

router.post("/polls/update", function(req, res){
    function listAllProperties(o) {
        var objectToInspect;     
        var result = [];
        
        for(objectToInspect = o; objectToInspect !== null; objectToInspect = Object.getPrototypeOf(objectToInspect)) {  
        result = result.concat(Object.getOwnPropertyNames(objectToInspect));  
        }
	
	    return result; 
    }

    var props =  listAllProperties(req.body);
    var poll = JSON.parse(props[0] ).poll;
    //console.log(poll);
    mongoExport.polls.update(poll, function(res){
        console.log(res);
    });
});


router.get("/user", function(req, res){
    var user = req.user;
    if(! user){
        user = {
            username: req.ip
        }
    }
    res.send(user);
})

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