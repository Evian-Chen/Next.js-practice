/**
 * /settings/route.js
 * This file update the model setup for a single time conversation
 */

import { connectDB } from "@/lib/mongodb";
import chatSettings from "@/models/chatSettings";

export async function POST(request) {
  try {
    /**
     * Only three options are opened to users to modify but there are more options in DB
     * params need to be processed
     */
    const userParams = await request.json();
    const dbParams = await getParams();

    console.log("user params: ", userParams);
    console.log("db params: ", dbParams);

    const newSettings = new chatSettings(userParams);
    await newSettings.save();

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

export async function getParams() {
  await connectDB();
  console.log("connected to MongoDB.")

  try {
    const dbParams = await chatSettings.findOne().sort({ createdAt: -1 });
    return dbParams;
  } catch (err) {
    console.error("Fetch DB params error: ", err);
    return null;
  }
}
