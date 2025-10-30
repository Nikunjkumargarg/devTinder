const express = require('express');
const profileRouter = express.Router();
const userAuth = require('../middlewares/auth');
const User = require('../modals/user');


profileRouter.get("/profile", userAuth, async(req,res)=>{
    try {
        res.send(req.user);
    } catch (error) {
        res.status(500).send({ error: error.message || "Internal server error" });
    }
});

module.exports = profileRouter;