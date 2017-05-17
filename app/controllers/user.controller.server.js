//modules
var models = require("./../../config/mongo");


exports.signup = function(req, res){
    models.users.create(req.body, function(err, response){
        if(err){console.error(err)};
        console.log(response);
    });

    //console.log(req.body);
    return res.redirect("/");
}


