const express = require('express');
const authRouter = express.Router();
const User = require('../modals/user');
const bcrypt = require('bcrypt');
const {validateSignUpData} = require('../utils/validation');
const jwt = require('jsonwebtoken');
const userAuth = require('../middlewares/auth');

authRouter.post("/signup", async(req,res)=>{       
    try {
        console.log("Signing up");
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

authRouter.post("/login", async(req,res)=>{
    try {
     const {emailId, password} = req.body;
     const user = await User.findOne({emailId});
     if(!user){
         return res.status(404).send("Invalid Credentials");
     }
     const isPasswordValid = await user.comparePassword(password);
     console.log("isPasswordValid", isPasswordValid);
     if(!isPasswordValid){
         return res.status(401).send("Invalid Credentials");
     }
    const token = await user.generateAuthToken();
    console.log("token", token);
    res.cookie("token", token, {httpOnly: true, secure: false, maxAge: 3600000});
    res.send("Login successful ");
    } catch (error) {
     res.status(500).send("something went wrong", error.message);
    }
 });

 authRouter.post("/logout", userAuth, async(req,res)=>{
    res.cookie("token", "", {httpOnly: true, secure: false, maxAge: 0});
    res.send("Logout successful");
 });

module.exports = authRouter;