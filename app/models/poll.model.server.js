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
            //console.log("within countPolls");
            //console.log(count)
            callback(count);
            db.close();
        });
    }); 
}



exports.create = function(document, res ){
  //console.log(collectionName);
    console.log(document);
    var poll    = document;
    countPolls(function(count){
    //poll.meeting = document.meeting;
    //poll.question = document.question;
    //poll.responseOptions = [];
    //document["responseOptions[]"].map(responseOption => poll.responseOptions.push(responseOption));
    //console.log(document["responseOptions[]"]);
    poll.id     = (count+1); 
    poll.date   = new Date;
    poll.votes  = [];
    poll.votingOpen = true;

    //console.log("within Create");
    //console.log(poll);

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
                //console.log(results );
                res(results);
            }else{
                res([{}]);
            }
            db.close();
        });
    });
}

exports.retrieveMeetings = function(searchText, res){
    //var limit = 5;
    var query = { };
    var db = mongo.connect(mongoUrl);
    mongo.connect(mongoUrl, function(err, db){
        if(err){console.error(err)};
        var collection = db.collection(collectionName);

        collection.distinct("meeting", function (err, results){
            if(err){console.error(err)}
        //collection.find({}).toArray(function (err, results){
            if (results.length > 0){
                //console.log(results );
                res(results);
            }else{
                res([{}]);
            }
            db.close();
        });
    });
}


exports.update = function(document, res ){
    //console.log(collectionName);
    //console.log(document);
    var poll    = document;
    delete poll._id;

    //console.log("within Update");
    //console.log( poll );

    var db = mongo.connect(mongoUrl);
    mongo.connect(mongoUrl, function(err, db){
        if(err){console.error(err)};
        var collection = db.collection( collectionName );
        collection.update({ id: poll.id},
                poll ,function(err, result){
                    if(err){console.error(err)}
                    console.log("updated document");
                    //console.log(result );
                    db.close();
                }
            );
    });
}


exports.delete = function(document, res ){
    //console.log(collectionName);
    //console.log(document);
    var poll    = document;
    delete poll._id;

    //console.log("within Delete");
    //console.log( poll );

    var db = mongo.connect(mongoUrl);
    mongo.connect(mongoUrl, function(err, db){
        if(err){console.error(err)};
        var collection = db.collection( collectionName );
        collection.deleteOne({ id: poll.id}, function(err, result){
                    if(err){console.error(err)}
                    //console.log("deleted document");
                    //console.log(result );
                    db.close();
                }
            );
    });
}
