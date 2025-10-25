const express = require("express");
const app = express();
//Order of routes are important...
//it's like matching the route extactly begines with mentioned one.


app.use("/user/:userId/:noshId",(req,res)=>{
    console.log(req.query);
    console.log(req.params);
    res.send("user data");
})

app.get("/employee",[(req,res,next)=>{
    // res.send("employee data");
    next();
},(req,res)=>{
    res.send("employee data 2")
}])


app.listen(3000,()=>{console.log("Application is listening on port no 3000")});