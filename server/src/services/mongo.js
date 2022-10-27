const mongoose = require('mongoose');

require('dotenv').config();

/* connect to MongoDB */
const MONGO_URL = process.env.MONGO_URL;

/* Mongoose Event Listeners */
mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!');
});
//emits events when the connection is ready or there are errors
mongoose.connection.on('error', (err) => {
    console.error(err);
});
//errors

async function mongoConnect() {
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
}