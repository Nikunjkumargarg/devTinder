const express = require('express');
const paymentRouter = express.Router();
const userAuth = require('../middlewares/auth');
const razorpayInstance = require('../utils/razorpay');
const membershipPlans = require('../utils/membershipPlans');
const { validateWebhookSignature } = require('razorpay/utils/validation');
const Payment = require('../modals/payment');
const User = require('../modals/user');

paymentRouter.post('/payment/create', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const {membership} = req.body;
    if(!membership){
      return res.status(400).send({ error: 'Membership is required' });
    }
    const plan = membershipPlans[membership];
    if(!plan){
      return res.status(400).send({ error: 'Invalid membership' });
    }
    const order = await razorpayInstance.orders.create({
      amount: plan.amount * 100,
      currency: plan.currency,
      receipt: `order_receipt#${loggedInUser._id}`,
      notes: {
        user_id: loggedInUser._id,
        firstname: loggedInUser.firstname,
        lastname: loggedInUser.lastname,
        membership: membership,
      },
    });
    res.json({ message: 'Order created successfully', data: order });
  } catch (err) {
    res.status(400).send({ error: err.message || 'Internal server error' });
  }
});

paymentRouter.post('/payment/webhook', async (req, res) => {
  try {
    const webhookSignature = req.headers('x-razorpay-signature');
    const isWebhookValid = await validateWebhookSignature(req.body, webhookSignature, process.env.RAZORPAY_WEBHOOK_SECRET);
    if(!isWebhookValid){
      return res.status(400).send({ error: 'Invalid signature' });
    }

    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({orderid: paymentDetails.order_id});
    payment.status = paymentDetails.status;
    await payment.save();
    console.log("payment saved");

    const user = await User.findOne({_id: payment.userid});
    user.membershipType = payment.notes.membership;
    user.isPremium = true;
    await user.save();
    console.log("user updated");

    // if(req.body.event === "payment.captured"){
      
    // }
    // if(req.body.event === "payment.failed"){}

    return res.status(200).send({ message: 'Webhook received successfully' });
  }
  catch (err) {
    res.status(400).send({ error: err.message || 'Internal server error' });
  }
});

paymentRouter.get('/premium/verify', userAuth, async (req, res) => {
try{
  const user = req.user;
  if(user.isPremium){
    return res.status(200).send({ message: 'User is already premium', isPremium: true });
  }
  return res.status(200).send({ message: 'User is not premium', isPremium: false });
} catch (err) {
  res.status(400).send({ error: err.message || 'Internal server error' });
});

module.exports = paymentRouter;
