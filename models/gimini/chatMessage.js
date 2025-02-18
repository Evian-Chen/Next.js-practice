import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    parts: { type: String, required: true },
  },
  { timestamps: true }
);

const chatMessage =
  mongoose.models.chatMessage || mongoose.model("chatMessage", chatSchema);

export default chatMessage;
