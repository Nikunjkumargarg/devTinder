// database.js
const mongoose = require('mongoose');

const url = 'mongodb+srv://aggarwalkgn_db_user:PkZyJp0g7hJYURXV@devtinder.tgtctlc.mongodb.net/devTinder';

async function dbConnect() {
    try {
        const result =await mongoose.connect(url);
        
    } catch (error) {
        console.error(error);
    }
}

module.exports = dbConnect;