    const express = require("express");
    const {authModule} = require("./auth");
    const app = express();
    const dbConnect = require("../database");
    const User = require("./modals/user");

    app.post("/user",(req,res)=>{
        const user = new User({
            firstname: "John",
            email: "john@example.com"
        });
        try {
            user.save();
        res.send(user);
        } catch (error) {
            res.status(500).send(error);
        }
        
    });

    dbConnect().then(()=>{
        console.log("Database connected");
        app.listen(3000,()=>{console.log("Application is listening on port no 3000")});
    }).catch((err)=>{
        console.log(err);
    });

    console.log("Database connection is pending");
    