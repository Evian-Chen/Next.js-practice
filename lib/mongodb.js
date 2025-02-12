/**
 * This file is to connect to MongoDB
 */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable in .env");
}

export async function connectDB() {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log("MongoDB connected.");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        throw new Error("Failed to connect to MongoDB");
    }
}
