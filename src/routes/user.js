const express = require('express');
const userRouter = express.Router();
const userAuth = require('../middlewares/auth');
const User = require('../modals/user');
const ConnectionRequest = require('../modals/connectionRequest');
const { connection } = require('mongoose');

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate('fromUserId', ['firstname', 'lastname', 'photoUrl', 'age', 'skills', 'about']);
    res.json({ message: 'Data fetched successfully', data: connections });
  } catch (error) {
    res.status(400).send({ error: error.message || 'Internal server error' });
  }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: 'accepted' },
        { toUserId: loggedInUser._id, status: 'accepted' },
      ],
    }).populate('fromUserId', ['firstname', 'lastname', 'age', 'skills', 'about'])
    .populate('toUserId', ['firstname', 'lastname', 'age', 'skills', 'about']);

    const data = connections.map((row) => {
        if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
            return row.toUserId;
        }
        else{
            return row.fromUserId;
        } 
    });
    res.json({ message: 'Data fetched successfully', data });
  } catch (error) {
    res.status(400).send({ error: error.message || 'Internal server error' });
  }
});

userRouter.get('/user/feed', userAuth, async (req, res) => {
  try { 
    const loggedInUser = req.user;
    //find connection requests that user have sent or received.
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId"); 

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach(request => {
      hideUsersFromFeed.add(request.fromUserId.toString());
      hideUsersFromFeed.add(request.toUserId.toString());
    });
    hideUsersFromFeed.add(loggedInUser._id.toString());

    const users = await User.find({ 
      _id: { $nin: Array.from(hideUsersFromFeed) }
    }).select("firstname lastname age skills about photoUrl");
    res.send(users);
  } catch (error) {
    res.status(400).send({ error: error.message || 'Internal server error' });
    }
  });
  
  module.exports = userRouter;