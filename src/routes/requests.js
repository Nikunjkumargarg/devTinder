const express = require('express');
const requestsRouter = express.Router();
const userAuth = require('../middlewares/auth');
const User = require('../modals/user');

requestsRouter.post("/request/:status/:userId", userAuth, async(req,res)=>{
    try {
        const fromUser = req.user;
        const {status, userId} = req.params;
        const toUser = await User.findById(userId);
        if(!toUser){
            return res.status(404).send("User not found");
        }

        const allowedStatuses = ["interested", "ignored"];
        if(!allowedStatuses.includes(status)){
            return res.status(400).send("Invalid status");
        }
        if(ConnectionRequest.exists($or: [{fromUserId: req.user._id, toUserId: userId}, {fromUserId: userId, toUserId: req.user._id}])){
            return res.status(400).send("Connection request already exists");
        }
        const connectionRequest = await ConnectionRequest.create({
            fromUserId: fromUser._id,
            toUserId: toUser._id,
            status: status
        });
        connectionRequest.save();
        console.log("Sending a connection request");
        res.send(user.firstname + " " + user.lastname + " has sent a connection request");
    } catch (error) {
        res.status(500).send({ error: error.message || "Internal server error" });
    }
});

module.exports = requestsRouter;