const express = require("express");
const {authModule} = require("./auth");
const app = express();
//Order of routes are important...
//it's like matching the route extactly begines with mentioned one.
//request -> middleware chain -> request handler
// request handler send response but middlewares does not. they can but generally they are worked like this. these are just normal functions, just lingos by developers.
app.use("/",(req,res,next)=>{
    next();
})

app.use("/admin", authModule,(req,res,next)=>{
    console.log("hello admin");
})

app.get("/employee",[(req,res,next)=>{
    res.send("employee response")
},(req,res,next)=>{
    // res.send("employee data 2")
    next();
}])

app.get("/employee",(req,res)=>{
    res.send("employee data 3");
})

app.listen(3000,()=>{console.log("Application is listening on port no 3000")});