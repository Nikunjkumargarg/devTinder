const express = require('express');
const requestsRouter = express.Router();
const userAuth = require('../middlewares/auth');
const User = require('../modals/user');
const ConnectionRequest = require('../modals/connectionRequest');
const sendEmail = require('../utils/sendEmail');

requestsRouter.post('/request/send/:status/:userId', userAuth, async (req, res) => {
  try {
    console.log("request initiated")
    const fromUser = req.user;
    const { status, userId } = req.params;
    const toUser = await User.findById(userId);
    if (!toUser) {
      return res.status(404).send('User not found');
    }

    const allowedStatuses = ['interested', 'ignored'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).send('Invalid status');
    }
    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: req.user._id, toUserId: userId },
        { fromUserId: userId, toUserId: req.user._id },
      ],
    });
    if (existingRequest) {
      return res.status(400).send('Connection request already exists');
    }
    const connectionRequest = new ConnectionRequest({
      fromUserId: fromUser._id,
      toUserId: toUser._id,
      status: status,
    });
    await connectionRequest.save();
    console.log("connection request saved");

    if(status === 'interested'){  
    const emailSubject = 'You have a new connection request on DevTinder';
    const emailHtmlBody = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6fb; padding: 32px 0;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);">
          <tr>
            <td style="padding: 28px 32px 16px;">
              <p style="margin: 0; font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; color: #6366f1; font-weight: 600;">Connection Request</p>
              <h1 style="margin: 12px 0 0; font-size: 24px; color: #0f172a;">${fromUser.firstname} ${fromUser.lastname} wants to connect</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 24px;">
              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #475569;">
                Hi ${toUser.firstname},<br/><br/>
                You just received a connection request on <strong>DevTinder</strong>. ${fromUser.firstname} ${fromUser.lastname} is excited to connect with you.
              </p>
              <div style="margin: 24px 0; padding: 20px; background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(129, 140, 248, 0.08)); border-radius: 12px;">
                <p style="margin: 0; font-size: 15px; color: #1e293b;">
                  <strong>Quick Preview</strong><br/>
                  “Hey ${toUser.firstname}, let's connect and explore opportunities together on DevTinder!”
                </p>
              </div>
              <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #475569;">
                Open DevTinder to accept, ask a question, or gently pass on this connection.
              </p>
              <a href="${process.env.APP_BASE_URL || '#'}" style="display: inline-block; padding: 14px 28px; font-size: 15px; font-weight: 600; color: #ffffff; background: linear-gradient(135deg, #6366f1, #4f46e5); border-radius: 999px; text-decoration: none;">Review request</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 32px 28px; background-color: #f8fafc;">
              <p style="margin: 0; font-size: 13px; color: #94a3b8;">You're receiving this email because you're part of DevTinder. Manage notification preferences in your profile settings.</p>
            </td>
          </tr>
        </table>
      </div>
    `;

    const emailResult = await sendEmail.run(
      'nikunj@euphotic.io',
      emailSubject,
      emailHtmlBody,
      `${fromUser.firstname} ${fromUser.lastname} has sent you a connection request on DevTinder. Sign in to review.`
    );
    console.log("emialresult", emailResult);
  }
    
    console.log('Sending a connection request');
    res.send(fromUser.firstname + ' ' + fromUser.lastname + ' has sent a connection request');
  } catch (error) {
    console.log("Error", error)
    res.status(500).send({ error: error.message || 'Internal server error' });
  }
});

requestsRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    const allowedStatuses = ['accepted', 'rejected'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status not allowed!' });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: 'interested',
    });

    if (!connectionRequest) {
      return res.status(404).json({ message: 'Connection request not found!' });
    }

    connectionRequest.status = status;

    const data = await connectionRequest.save();

    res.json({ message: 'Connection request updated successfully', data });
  } catch (error) {
    res.status(500).send({ error: error.message || 'Internal server error' });
  }
});

module.exports = requestsRouter;
