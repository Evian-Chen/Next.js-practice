/**
 * This file is to connect to MongoDB
 */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// build MongoDB connection
const connectDB = async () => {
    if (mongoose.connections[0].readyState) {
        return;  // already connected
    }
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("connected to MongoDB.");
    } catch (err) {
        console.error("MongoDB connection error: ", err);
    }
};

export default connectDB;