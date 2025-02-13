/**
 * This file is to connect to MongoDB
 */

import chatSettings from "@/models/chatSettings";
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

        // check if there are settings history in DB
        const existingSettings = await chatSettings.findOne();
        if (!existingSettings) {
            await chatSettings.create({
                model: "gpt-4o-mini",
                n: 1,
                max_tokens: 100,
                temperature: 0.7,
                top_p: 1,
                presence_penalty: 0,
                frequency_penalty: 0,
                stream: false,
                logit_bias: null,
                stop: null,   
            });
            console.log("Inserted default chat settings into MongoDB.");
        }
    } catch (err) {
        console.error("MongoDB connection error:", err);
        throw new Error("Failed to connect to MongoDB");
    }
}