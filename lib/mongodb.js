/**
 * This file is to connect to MongoDB
 */

import chatSettings from "@/models/chatgpt/chatSettings";
import mongoose, { connection, model } from "mongoose";

const DB_URIS = {
  chatgpt: process.env.MONGODB_URI_CHATGPT,
  gemini: process.env.MONGODB_URI_GEMINI,
  perplexity: process.env.MONGODB_URI_PERPLEXITY,
};

for (const [key, uri] of Object.entries(DB_URIS)) {
  if (!uri || typeof uri !== "string") {
    throw new Error(
      `MONGODB_URI_${key.toUpperCase()} is not defined or not string`
    );
  }
}

const connections = {};

/**
 *
 * @param {*} modelType - is the model waited to be connected
 * @returns
 */
export async function connectDB(modelType = "chatgpt") {
  // current modelType not existed
  if (!DB_URIS[modelType]) {
    throw new Error("invalid model type");
  }

  if (connections[modelType] && connections[modelType].readyState >= 1) {
    console.log(`Already connected to mongoDB ${modelType}`);
    return connections[modelType];
  }

  try {
    const newConnection = await mongoose.createConnection(DB_URIS[modelType], {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    connections[modelType] = newConnection; // newConnection is an Object
    console.log(`MongoDB connected to ${modelType}`);

    // check if there are settings history in DB
    // const existingSettings = await chatSettings.findOne();
    // if (!existingSettings) {
    //   await chatSettings.create({
    //     model: "gpt-4o-mini",
    //     n: 1,
    //     max_tokens: 50,
    //     temperature: 0.7,
    //     top_p: 1,
    //     presence_penalty: 0,
    //     frequency_penalty: 0,
    //     stream: false,
    //     logit_bias: null,
    //     stop: null,
    //   });
    //   console.log("Inserted default chat settings into MongoDB.");
    // }

    return connections[modelType];
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw new Error("Failed to connect to MongoDB");
  }
}
