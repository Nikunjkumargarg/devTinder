const express = require('express');
const requestsRouter = express.Router();
const userAuth = require('../middlewares/auth');
const User = require('../modals/user');

requestsRouter.post("/sendConnectionRequest", userAuth, async(req,res)=>{
    try {
        const user = req.user;
        console.log("Sending a connection request");
        res.send(user.firstname + " " + user.lastname + " has sent a connection request");
    } catch (error) {
        res.status(500).send({ error: error.message || "Internal server error" });
    }
});

module.exports = requestsRouter;