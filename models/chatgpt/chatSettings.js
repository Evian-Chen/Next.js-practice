/**
 * This file is to define model setup schema.
 * NOT include message, message is a JSON format collected from /history
 */

import mongoose from "mongoose";

const setupSchema = new mongoose.Schema({
    model: { type: String, required: true },
    // message: { type: JSON, default: "", required: true },
    n: { type: Number, required: true },
    max_tokens: { type: Number, required: true },
    temperature: { type: Number, required: false },
    top_p: { type: Number, required: false },
    presence_penalty: { type: Number, required: false },
    frequency_penalty: { type: Number, required: false },
    stream: { type: Boolean, required: false },
    logit_bias: { type: Map, default: null, required: false },
    stop: { type: mongoose.Schema.Types.Mixed, default: null, required: false },
}, {timestamps: true});

const chatSettings = mongoose.models.chatSettings || mongoose.model("chatSettings", setupSchema);

export default chatSettings;