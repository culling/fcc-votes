//modules
var models = require("./../../config/mongo");


exports.create = function(req, res){
    models.polls.create(req.body, function(err, response){
        if(err){
            console.error(err)
            return res.redirect("/drafts/polls/new/");
        }else{
            return res.redirect("/");
        };
    })
}

exports.statusChange          = function(io, socket){
    io.emit("new state",function(){
        console.log("io emit - polls.controller.servr.js")
    } );

    socket.on("new state", function(){
        console.log("socket on - polls.controller.servr.js")
        io.emit("new state");
    });
}