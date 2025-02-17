import mongoose from "mongoose";

const tokenInfoSchema = new mongoose.Schema(
  {
    prompt: { type: Number, default: 0 },
    completion: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const tokenInfo =
  mongoose.models.tokenInfo || mongoose.model("tokenInfo", tokenInfoSchema);

export default tokenInfo;
