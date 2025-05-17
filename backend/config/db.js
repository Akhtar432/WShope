const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB Connected successfully:");
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        process.exit(1); 
    }
};

module.exports = connectDB;