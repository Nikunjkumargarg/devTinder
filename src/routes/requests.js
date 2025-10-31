const express = require('express');
const requestsRouter = express.Router();
const userAuth = require('../middlewares/auth');
const User = require('../modals/user');
const ConnectionRequest = require('../modals/connectionRequest');

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
        const existingRequest = await ConnectionRequest.findOne({
            $or: [{fromUserId: req.user._id, toUserId: userId}, {fromUserId: userId, toUserId: req.user._id}]
        });
        if(existingRequest){
            return res.status(400).send("Connection request already exists");
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId: fromUser._id,
            toUserId: toUser._id,
            status: status
        });
        await connectionRequest.save();
        console.log("Sending a connection request");
        res.send(fromUser.firstname + " " + fromUser.lastname + " has sent a connection request");
    } catch (error) {
        res.status(500).send({ error: error.message || "Internal server error" });
    }
});

module.exports = requestsRouter;