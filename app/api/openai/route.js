/**
 * /openai/route.js
 * This file get user message input and save it to MongoDB
 */

import { connectDB } from "@/lib/mongodb";
import { OpenAI } from "openai";
import chatMessageSchema from "@/models/chatgpt/chatMessage";
import chatSettingsSchema from "@/models/chatgpt/chatSettings";
import tokenInfoSchema from "@/models/chatgpt/tokenInfo";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const db = await connectDB("chatgpt");

// setup all chatgpt db collections' connections
const ChatMessage =
  db.models.chatMessage || db.model("chatMessage", chatMessageSchema);
const ChatSettings =
  db.models.chatSettings || db.model("chatSettings", chatSettingsSchema);
const TokenInfo =
  db.models.tokenInfo || db.model("tokenInfo", tokenInfoSchema);

/***
 * This funtion save msg from frontend to MongoDB Atlas and save the in DB
 */
export async function POST(request) {
  console.log("send POST function received.");


  try {
    const { role, content } = await request.json();

    if (!content) {
      return new Response(
        JSON.stringify({ error: "content is required" }, { status: 400 })
      );
    }

    // create a Mongo obj and put role and content in
    const newMessage = new ChatMessage({ role, content });
    await newMessage.save();

    // get history message from MongoDB
    const history = await ChatMessage.find();
    const historyMsg = history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // get history setting
    const newSetting = await ChatSettings.findOne().sort({ createdAt: -1 });

    // newSetting is mongoose, not an object
    const settingsObj = newSetting.toObject();
    const { _id, createdAt, updatedAt, __v, ...settings } = settingsObj;
    const gptInput = { ...settings, messages: historyMsg };

    const aiReply = await openai.chat.completions.create(gptInput);

    const aiMsg = new ChatMessage({
      role: aiReply.choices[0].message.role,
      content: aiReply.choices[0].message.content,
    });
    await aiMsg.save();

    console.log("ai reply:");
    console.log(aiReply);

    // overwrite the current tokens information
    const tokens = await TokenInfo.findOneAndUpdate(
      {}, // find the first data
      {
        prompt: aiReply.usage.prompt_tokens,
        completion: aiReply.usage.completion_tokens,
        total: aiReply.usage.total_tokens,
      },
      {
        new: true,
        upsert: true,
      }
    );

    console.log("updated tokens:");
    console.log(aiReply.choices[0].message);

    return new Response(
      JSON.stringify({ result: "ok", message: "msg saved" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("error: ", err);
    return new Response(
      JSON.stringify({ result: "error", messaage: "invalid" }),
      { status: 400 }
    );
  }
}

export async function GET() {

  try {
    let tokenData = await TokenInfo.findOne();

    if (!tokenData) {
      tokenData = new TokenInfo({
        prompt: 0,
        completion: 0,
        total: 0,
      });

      await tokenData.save();
    }

    return new Response(JSON.stringify(tokenData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Fetch token data error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch token data" }),
      { status: 500 }
    );
  }
}
