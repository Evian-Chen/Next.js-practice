import mongoose from "mongoose";

const setupSchema = new mongoose.Schema({
    model: { type: String, required: true },
    generationConfig: { type: Map, of: new Schema ({
        temperature: {type: Number, default: 1.0 },
        maxOutputTokens: {type: Number, default: 30 },
        topP: {type: Number, default: 0.8 },
        topK: {type: Number, default: 1.0 }
    })},
}, {timestamps: true});

const chatSettings = mongoose.models.chatSettings || mongoose.model("chatSettings", setupSchema);

export default chatSettings;

/***
 * demo input with params:
 * 
 * data = {
    "contents": [
        {
            "parts": [{"text": "你知道王建民嗎？"}]
        }
    ],
    "safetySettings": [
        {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": "BLOCK_NONE"
        }
    ],
    "generationConfig": {
        "temperature": 1.0,
        "maxOutputTokens": 30,
        "topP": 0.8,
        "topK": 10
    }
}
 */