require("dotenv").config();

var authentication = function(req, res, next){
    if(req.headers.authorization == process.env.AUTH_KEY){
        next()
    }
    else{
        res.sendStatus(403);
    }
    ;
    
}

module.exports = authentication;