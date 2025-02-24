import mongoose from "mongoose";

const tokenInfoSchema = new mongoose.Schema(
  {
    prompt: { type: Number, default: 0 },
    completion: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default tokenInfoSchema;
