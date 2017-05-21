var config  = require("./../../config/config");

// mongo
var mongo               =   require("mongodb").MongoClient;
var mongoPort           = config.mongoPort;
var mongoDatabase       = config.mongoDatabase;
var collectionName      = "polls";
var mongoUrl =  `mongodb://localhost:${mongoPort}/${mongoDatabase}`;
