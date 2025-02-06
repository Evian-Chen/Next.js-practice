import { promises as fs } from "fs";
import path from "path";

const templatePath = path.join(process.cwd(), "public", "chat", "msg_template.json");
const logPath = path.join(process.cwd(), "public", "chat", "conv_log.json");


/***
 * This funtin sent the msg typed in the text bax to backend API
 * and save the msg in conv_log.json
 */
export async function POST(request) {
    try {
        const bodyMsg = await request.text();
        const msg = JSON.stringify(bodyMsg);

        // test
        console.log(msg);

        const newMsg = {
            "role": "user",
            "content": msg.content
        };


    } catch (err) {
        console.error("error: ", err);
        return new Response(JSON.stringify({ result: "error", messaage: "invalid"}), {status: 400});

    }
}


/**
 * This function update conversation history, so the history can be sent to ChatGPT API
 * to continue the conversation (so that ChatGPT can remember the content)
 * @param {*} msg : the text user typed in the text box
 * @returns 
 */
function updateLog(msg) {
    return;
}