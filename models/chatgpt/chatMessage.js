/**
 * This file is to define message schema.
 */

import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default chatSchema;
