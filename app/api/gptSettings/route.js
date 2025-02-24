/**
 * /settings/route.js
 * This file update the model setup for a single time conversation
 */

import chatSettingsSchema from "@/models/chatgpt/chatSettings";
import { connectDB } from "@/lib/mongodb";

export async function POST(request) {
  try {
    // connect to correct database
    const db = await connectDB("chatgpt");
    const chatsettings = db.models.chatSettings || db.model("chatSettings", chatSettingsSchema);

    const userParams = await request.json();

    const updateSettings = await chatsettings.findOneAndUpdate(
      {}, // find the first one
      userParams,
      { upsert: true, new: true }
    );

    console.log("setting saved successfully");

    return new Response(
      JSON.stringify({ result: "ok", message: "settings saved" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Post settings error: ", err);
    return new Response(
      JSON.stringify({ error: "Failed to update settings" }),
      { status: 500 }
    );
  }
}
