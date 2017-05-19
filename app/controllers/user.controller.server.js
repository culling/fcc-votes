//modules
var models = require("./../../config/mongo");


exports.signup = function(req, res){
    models.users.create(req.body, function(err, response){
        if(err){
            console.error(err)
            return res.render('login', {message:err});
        }else{
            return res.redirect("/");    
        };
    })
}


