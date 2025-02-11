/**
 * THis file should handle some backend functions and implementations
 */

import path from "path";
import connectDB from "@/lib/mongodb";
import chatMessage from "@/models/chatMessage";

const templatePath = path.join(process.cwd(), "public", "chat", "msg_template.json");
const logPath = path.join(process.cwd(), "public", "chat", "conv_log.json");
const setupPath = path.join(process.cwd(), "public", "chat", "setup.json");
const API_KEY = process.env.OPENAI_API_KEY;

/**
 * This function call ChatAPI to request response
 * 1. get history conversation in json format
 * 2. call ChatGPT API
 * 3. add aiReply into conv_log.json
 * 4. return AI reply in json format
 * @returns : json format, ai reply (includes role and content)
 */
export async function chat() {
    // const convHistory = await fs.readFile(logPath, "utf-8");
    // const setParam = await fs.readFile(setupPath, "utf-8");

    // get param from the frontend

    // prepare input for ChatGPT API

    // get reply
    // const aiReply = await fetch("https://api.openai.com/v1/chat/completions", {

    // })

    // save reply to log

    // return aiReply
}

/**
 * This funciton fetch conversation history from MongoDB and return it 
 */
export async function GET() {
    await connectDB();

    try {
        // get all conversation history, in time order
        const messages = await chatMessage.find().sort({ createdAt: 1 });
        return new Response(JSON.stringify(messages), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({error: "Failed to fetch msg from MongoDB"}), {status: 500});
    }
}

/***
 * This funtion save msg from frontend to MongoDB Atlas
 * and save the msg in conv_log.json
 * 1. request text from the frontend
 * 2. save msg to conv_log.json and show user text on the console
 * 3. call chat function and get AI reply
 * 4. show the AI reply on the console
 */
export async function POST(request) {
    await connectDB();

    try {
        const { role, content } = await request.json();

        if (!content) {
            return new Response(JSON.stringify({error: "content is required"}, {status: 400}));
        }

        // create a Mongo obj and put role and content in
        const newMessage = new chatMessage({ role, content })
        await newMessage.save();

        // get AI reply, json format
        const aiReply = chat();

        // it needs response anyways, but here i need a function to handle 
        // asking reply for ChatGPT, so return a temporary Response for now
        return new Response(JSON.stringify({result: "ok", message: "msg saved"}), {status: 200});

    } catch (err) {
        console.error("error: ", err);
        return new Response(JSON.stringify({ result: "error", messaage: "invalid"}), {status: 400});

    }
}

/**
 * This funciton get user param from fronted API and save it to setup.json
 * @param {*} request 
 * @returns 
 */
export async function POSTPARAM(request) {
    return;
}