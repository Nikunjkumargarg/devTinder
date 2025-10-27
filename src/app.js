    const express = require("express");
    const {authModule} = require("./auth");
    const app = express();
    const dbConnect = require("../database");
    const User = require("./modals/user");

    app.use(express.json());

    app.post("/user",(req,res)=>{
        try {
            const user = new User(req.body);
            user.save();
        res.send(user);
        } catch (error) {
            res.status(500).send(error);
        }
        
    });

    app.get("/user", async(req,res)=>{
        try {
            const users = await User.find({emailId: req.body.emailId}); 
            if(users.length === 0){
                return res.status(404).send("User not found");
            } else {
                res.send(users);
            }
        } catch (error) {
            res.status(500).send("something went wrong", error.message);
        }
    });

    app.get("/feed", async(req,res)=>{
        try {
            const users = await User.find({});
            res.send(users);
        } catch (error) {
            res.status(500).send("something went wrong", error.message);
        }
    });

    dbConnect().then(()=>{
        console.log("Database connected");
        app.listen(3000,()=>{console.log("Application is listening on port no 3000")});
    }).catch((err)=>{
        console.log(err);
    });
    