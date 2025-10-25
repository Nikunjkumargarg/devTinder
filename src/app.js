const express = require("express");
const {authModule} = require("./auth");
const app = express();
//Order of routes are important...
//it's like matching the route extactly begines with mentioned one.
//request -> middleware chain -> request handler
// request handler send response but middlewares does not. they can but generally they are worked like this. these are just normal functions, just lingos by developers.


app.get("/employee",(req,res,next)=>{
    throw new Error('abcdef');
    next();
})

app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send("Something went wrong");
    }
})

app.listen(3000,()=>{console.log("Application is listening on port no 3000")});