var config  = require("./../../config/config");

// mongo
var mongo               =   require("mongodb").MongoClient;
var mongoPort           = config.mongoPort;
var mongoDatabase       = config.mongoDatabase;
var collectionName      = "users";
var mongoUrl =  `mongodb://localhost:${mongoPort}/${mongoDatabase}`;

var records = [
    { id: 1, username: 'jack', password: 'secret', displayName: 'Jack', emails: [ { value: 'jack@example.com' } ] }
  , { id: 2, username: 'jill', password: 'birthday', displayName: 'Jill', emails: [ { value: 'jill@example.com' } ] }
];

/*
exports.findById = function(id, cb) {
  console.log("findById has been run");
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      console.log(records[idx]);
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

exports.findByUsername = function(username, cb) {
  console.log("findByUsername has been run");
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        console.log(record);
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}
*/

exports.findById = function(id, res){
    console.log("Find by Id called");
    var query = { _id : id };
    var db = mongo.connect(mongoUrl);
    mongo.connect(mongoUrl, function(err, db){
        if(err){console.error(err)};
        var collection = db.collection(collectionName);

        var results = collection.findOne({_id: id},{}, function(err, result){
        //collection.find({}).toArray(function (err, results){
            if(err){console.error(err)};
            if (result){
                console.log(result);
                console.log("found user")
                db.close();
                res(null, JSON.stringify(result) );
            }else{
                console.log("didnt find user")
                db.close();
                //return res(null, null);
                res(new Error('User ' + id + ' does not exist'));
                
            }
            //db.close();
            });
    });
}




exports.findByUsername = function(username, res){
    console.log("Find by Username called");
    var query = {username : username };
    var db = mongo.connect(mongoUrl);
    mongo.connect(mongoUrl, function(err, db){
        if(err){console.error(err)};
        var collection = db.collection(collectionName);
        var results = collection.findOne({username: username},{}, function(err, result){
        //collection.find({}).toArray(function (err, results){
            if(err){console.error(err)};
            if (result){
                //console.log(result);
                //console.log("found user")
                db.close();
                return res(null, result );
            }else{
                console.log("didnt find user")
                db.close();
                return res(null, null );
            }
            //db.close();
            });
    });
}



exports.create = function(document, res){
  //console.log(collectionName);
    var db = mongo.connect(mongoUrl);
    mongo.connect(mongoUrl, function(err, db){
        if(err){console.error(err)};
        var collection = db.collection( collectionName );
        collection.insertOne(document, function(err){
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