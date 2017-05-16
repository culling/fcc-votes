exports.renderSignin = function(req, res, next){
    if(!req.user){
        res.render("signin", {
            title:      "Sign-In Form"
        });
        console.log(req.body);
    }else{
        return res.redirect("/" + req.user.username);
    }
}