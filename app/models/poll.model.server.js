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
        var collection = db.collection(mongoCollectionName);
        collection.count({}
        , function(err, count){
            if(err){console.error(err)};
            if(count == null){
                count= 0;
            }

            callback(count);
            db.close();
        });
    });
}


exports.create = function(document, res ){
  //console.log(collectionName);
    var poll    = document;
    poll.id     = countDocuments(function(count){ return (count+1) });
    poll.date   = new Date;
    poll.votingOpen = true;

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
}
