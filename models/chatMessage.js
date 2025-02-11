/**
 * This file is to define data structure.
 */

import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    role: {type: String, required: true },
    content: {type: String, required: trusted,}
}, {timestamps: true});

const chatMessage = mongoose.models.chatMessage || mongoose.model("chatMessage", chatSchema);

export default chatMessage;