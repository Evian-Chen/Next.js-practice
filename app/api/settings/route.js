/**
 * /settings/route.js
 * This file update the model setup for a single time conversation
 */

import chatSettings from "@/models/chatSettings";

export async function POST(request) {
  try {
    /**
     * Only three options are opened to users to modify but there are more options in DB
     * params need to be processed
     */
    const userParams = await request.json();

    const newSettings = new chatSettings(userParams);
    await newSettings.save();
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
