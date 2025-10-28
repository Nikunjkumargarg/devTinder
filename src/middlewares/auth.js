const authModule = (req,res,next)=>{
    const authPass = "xyz";
    const isAdmin = authPass === "xyz";
    if(!isAdmin){
        return res.status(401).send("Unauthorized access");
    }
    next();
}

module.exports = authModule;