var config  = require("./../../config/config");

// mongo
var mongo               =   require("mongodb").MongoClient;
var mongoPort           = config.mongoPort;
var mongoDatabase       = config.mongoDatabase;
var collectionName      = "user";
var mongoUrl =  `mongodb://localhost:${mongoPort}/${mongoDatabase}`;


var records = [
    { id: 1, username: 'jack', password: 'secret', displayName: 'Jack', emails: [ { value: 'jack@example.com' } ] }
  , { id: 2, username: 'jill', password: 'birthday', displayName: 'Jill', emails: [ { value: 'jill@example.com' } ] }
];


exports.findById = function(id, cb) {
  console.log("findById has been run");
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
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
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}


/*
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
*/