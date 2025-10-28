    const express = require("express");
    const {authModule} = require("./middlewares/auth");
    const app = express();
    const dbConnect = require("./config/database");
    const User = require("./modals/user");
    const {validateSignUpData} = require("./utils/validation");
    const bcrypt = require("bcrypt")

    app.use(express.json());

    app.post("/signup", async(req,res)=>{

        try {
            validateSignUpData(req);
            const {firstname, lastname, emailId, password} = req.body;
            console.log(password);
            const passwordHash = await bcrypt.hash(password, 10);
            console.log(passwordHash);
            req.body.password = passwordHash;
            const user = new User({
                firstname,
                lastname,
                emailId,
                password: passwordHash
            });
            await user.save();
            res.send(user);
        } catch (error) {
            res.status(500).send("Error saving user: " +error.message);
        }
    });

    app.post("/login", async(req,res)=>{
       try {
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId});
        if(!user){
            return res.status(404).send("User not found");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).send("Invalid password");
        }
        res.send("Login successful");
       } catch (error) {
        res.status(500).send("something went wrong", error.message);
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
    