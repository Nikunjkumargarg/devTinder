    const express = require("express");
    const {authModule} = require("./middlewares/auth");
    const app = express();
    const dbConnect = require("./config/database");
    const User = require("./modals/user");
    const {validateSignUpData} = require("./utils/validation");
    const bcrypt = require("bcrypt");
    const jwt = require("jsonwebtoken");
    const userAuth = require("./middlewares/auth");
    const cookieParser = require("cookie-parser");


    app.use(express.json());
    app.use(cookieParser());

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
            return res.status(404).send("Invalid Credentials");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).send("Invalid Credentials");
        }
        const token = jwt.sign({emailId: user.emailId, _id: user._id}, "secret", {expiresIn: "1h"});
        res.cookie("token", token, {httpOnly: true, secure: true, maxAge: 3600000});
        res.send("Login successful ");
       } catch (error) {
        res.status(500).send("something went wrong", error.message);
       }
    });

    app.get("/profile", userAuth, async(req,res)=>{
       res.send(req.user);
    });


    dbConnect().then(()=>{
        console.log("Database connected");
        app.listen(3000,()=>{console.log("Application is listening on port no 3000")});
    }).catch((err)=>{
        console.log(err);
    });
    