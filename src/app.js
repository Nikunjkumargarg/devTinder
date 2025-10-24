const express = require("express");
const app = express();

app.use("/test",(req,res)=>{
    res.send("Hello from the server")
})

app.listen(3000,()=>{console.log("Application is listening on port no 3000")});