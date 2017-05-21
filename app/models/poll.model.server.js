var config  = require("./../../config/config");

// mongo
var mongo               =   require("mongodb").MongoClient;
var mongoPort           = config.mongoPort;
var mongoDatabase       = config.mongoDatabase;
var collectionName      = "polls";
var mongoUrl =  `mongodb://localhost:${mongoPort}/${mongoDatabase}`;



function countPolls(callback){
    mongo.connect(mongoUrl, function(err, db ){
        if(err){console.error(err)};
        var collection = db.collection(collectionName);
        collection.count({}
        , function(err, count){
            if(err){console.error(err)};
            if(count == null){
                count= 0;
            }
            console.log("within countPolls");
            console.log(count)
            callback(count);
            db.close();
        });
    }); 
}



exports.create = function(document, res ){
  //console.log(collectionName);
    var poll    = document;
    countPolls(function(count){
    poll.id     = (count+1); 
    poll.date   = new Date;
    poll.votes  = [];
    poll.votingOpen = true;

    console.log("within Create");
    console.log(poll);

    var db = mongo.connect(mongoUrl);
    mongo.connect(mongoUrl, function(err, db){
        if(err){console.error(err)};
        var collection = db.collection( collectionName );
        collection.insertOne(poll, function(err){
            if(err){console.error(err)}
            collection.findOne(document,
            {},
            function(err, document){
                if(err){console.error(err)};
                res(null, document);
                db.close();
            });
        });
    });
    });
}

exports.retrieve = function(searchText, res){
    //var limit = 5;
    var query = { };
    var db = mongo.connect(mongoUrl);
    mongo.connect(mongoUrl, function(err, db){
        if(err){console.error(err)};
        var collection = db.collection(collectionName);

        collection.find(query).sort({"id": -1}).toArray(function (err, results){
            if(err){console.error(err)}
        //collection.find({}).toArray(function (err, results){
            if (results.length > 0){
                console.log(results );
                res(results);
            }else{
                res([{}]);
            }
            db.close();
        });
    });
}