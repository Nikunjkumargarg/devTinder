    const express = require("express");
    const {authModule} = require("./auth");
    const app = express();
    const dbConnect = require("../database");
    const User = require("./modals/user");

    app.use(express.json());

    app.post("/user", async(req,res)=>{
        try {
            const user = new User(req.body);
            await user.save();
            res.send(user);
        } catch (error) {
            res.status(500).send("Error saving user: " +error.message);
        }
    });

    app.get("/user/:emailId", async(req,res)=>{
        try {
            const users = await User.find({emailId: req.params.emailId}); 
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

    app.delete("/user/:id", async(req,res)=>{
        try {
            const users = await User.findByIdAndDelete(req.params.id);
            res.send(users);
        } catch (error) {
            res.status(500).send("something went wrong", error.message);
        }
    });

    app.patch("/user", async(req,res)=>{
        try {
            const allowedFields = ["password", "age", "gender", "photoUrl", "about", "skills"];
            const isUpdateAllowed = Object.keys(req.body).every(field => allowedFields.includes(field));
            if(!isUpdateAllowed){
                throw new Error("Invalid fields");
            }
            if(req.body.skills.length > 10){
                throw new Error("Skills must be less than 10");
            }
            const users = await User.findOneAndUpdate({emailId: req.body.emailId}, req.body, {returnDocument: "after", runValidators: true});
            res.send(users);
        } catch (error) {
            console.log(error)
            res.status(500).send("something went wrong", error.message);
        }
    }); 

    dbConnect().then(()=>{
        console.log("Database connected");
        app.listen(3000,()=>{console.log("Application is listening on port no 3000")});
    }).catch((err)=>{
        console.log(err);
    });
    