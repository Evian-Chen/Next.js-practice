/**
 * This file get user message input and save it to MongoDB
 */

import connectDB from "@/lib/mongodb";
import chatMessage from "@/models/chatMessage";

/***
 * This funtion save msg from frontend to MongoDB Atlas and save the in DB
 */
export async function POST(request) {
    console.log("send POST function received.");
    await connectDB();

    try {
        const { role, content } = await request.json();

        if (!content) {
            return new Response(JSON.stringify({error: "content is required"}, {status: 400}));
        }

        // create a Mongo obj and put role and content in
        const newMessage = new chatMessage({ role, content })
        await newMessage.save();

        return new Response(JSON.stringify({result: "ok", message: "msg saved"}), {status: 200});

    } catch (err) {
        console.error("error: ", err);
        return new Response(JSON.stringify({ result: "error", messaage: "invalid"}), {status: 400});
    }
}