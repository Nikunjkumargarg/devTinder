const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'captured', 'failed'],
        default: 'pending',
        required: true,
    },
    receipt: {
        type: String,
        required: true,
    },
    notes: {
        type: Object,
        required: true,
    },
    orderid: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;