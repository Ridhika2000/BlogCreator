const jwt = require('jsonwebtoken')
const User = require("../model/user")


const authenticate = async (req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token,process.env.JWT_KEY);
        console.log(verifyUser)
        const user = await User.findOne({_id:verifyUser._id})
        req.token = token;
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).send(error);
    }
        
}

module.exports = authenticate