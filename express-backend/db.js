const mongoose = require("mongoose");
require("dotenv").config();

// Prefer common env var names, fall back to legacy `url` if present, else default to localhost.
const MONGO_URI = process.env.MONGO_URL || process.env.MONGO_URL || process.env.url || 'mongodb://127.0.0.1:27017/codegenius';

if (!MONGO_URI) {
    console.error('MongoDB connection string is not set. Please set MONGO_URI in your .env file.');
    // Exporting a rejected promise so awaiting code will see the failure.
    const rejected = Promise.reject(new Error('Missing MongoDB URL'));
    module.exports = { connection: rejected };
} else {
    const connection = mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    module.exports = {
        connection
    };
}
