/**
 * This file is to define model setup schema.
 */

import mongoose from "mongoose";

const setupSchema = new mongoose.Schema({
    model: { type: String, required: true },
    message: { type: JSON, required: true },
    n: { type: Number, required: true },
    max_tokens: { type: String, required: true },
    temperature: { type: Number, required: false },
    top_p: { type: Number, required: false },
    presence_penalty: { type: Number, required: false },
    frequency_penalty: { type: Number, required: false },
    stream: { type: Boolean, required: false },
    logit_bias: { type: null, required: false },
    stop: { type: null, required: false },

}, {timestamps: true});

const setupParams = mongoose.models.setupParams || mongoose.model("setupParams", setupSchema);

export default setupParams;