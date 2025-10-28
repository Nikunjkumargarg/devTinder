const jwt = require("jsonwebtoken");
const User = require("../modals/user");

const userAuth = async (req,res,next)=>{
    console.log("comiing")
    const token = req.cookies?.token;
    console.log("token", token);
    if(!token){
        return res.status(401).send("Unauthorized access");
    }
    const decoded = jwt.verify(token, "secret");
    const user = await User.findById(decoded._id);
    if(!user){
        return res.status(401).send("Unauthorized access");
    }
    req.user = user;
    next();
}

module.exports = userAuth;