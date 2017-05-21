//modules
var models = require("./../../config/mongo");


exports.signup = function(req, res){
    models.polls.create(req.body, function(err, response){
        if(err){
            console.error(err)
            //return res.render('/polls/new', {messages: [err]});
            return res.redirect("/drafts/polls/new/");
        }else{
            return res.redirect("/");
        };
    })
}
