const mongoose = require('mongoose');
const User = require('./user');

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ['interested', 'ignored'],
        message: 'Status must be either interested, ignored',
      },
      default: 'interested',
      required: true,
    },
  },
  { timestamps: true }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true }); //compound index.

connectionRequestSchema.pre('save', async function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId === connectionRequest.toUserId) {
    throw new Error('You cannot send a connection request to yourself');
  }
  next();
});

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequest;
