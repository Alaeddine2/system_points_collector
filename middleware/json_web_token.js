const configs = require('../config/config');
const jwt = require("jsonwebtoken")
require('dotenv').config()

module.exports = { 
    signJWT: 
    function(currentUser){
        return jwt.sign(currentUser, (process.env.ACCESS_TOKEN_SECRET || configs.JWT_KEY), {
            expiresIn : process.env.JWT_TOKEN_EXPIRATION_TIME
        })
    },
    authenticateToken: function (req, res, next){
        const authHeader = req.headers['authorization'] 
        const token = authHeader && authHeader.split(' ')[1]
        if(token == null) return res.status(405).json({
            code: "API.INVALID.TOKEN",
            message: "Invalid token",
            success: false,
            error: null
        });
    
        jwt.verify(token, (process.env.ACCESS_TOKEN_SECRET || configs.JWT_KEY), (err, user) => {
            if(err) 
                return res.status(405).json({
                    code: "API.INVALID.TOKEN",
                    message: "Invalid token",
                    success: false,
                    error: err
                });
            req.user = user
            next()
        })
    },
    getCurrentUser:
    function(accessToken){
        return jwt.decode(accessToken, (process.env.ACCESS_TOKEN_SECRET || configs.JWT_KEY))
    },
}
