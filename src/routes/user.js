const express = require('express');
const userRouter = express.Router();
const userAuth = require('../middlewares/auth');
const User = require('../modals/user');
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
        if(connections.fromUserId._id === loggedInUser._id){
            return connections.toUserId;
        }
        else{
            return connections.fromUserId;
        }
    });
    res.json({ message: 'Data fetched successfully', data });
  } catch (error) {
    res.status(400).send({ error: error.message || 'Internal server error' });
  }
});
