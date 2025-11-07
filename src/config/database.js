// database.js
const mongoose = require('mongoose');

const url = process.env.MONGODB_URL;

async function dbConnect() {
  try {
    const result = await mongoose.connect(url);
  } catch (error) {
    console.error(error);
  }
}

module.exports = dbConnect;
