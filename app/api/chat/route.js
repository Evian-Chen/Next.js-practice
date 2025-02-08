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
        const msg = JSON.parse(bodyMsg);

        // must have content
        if (!msg.content) {
            return new Response(JSON.stringify({result: "error", message: "content required"}), {status: 400});
        }

        // test
        console.log("msg:", msg);

        const newMsg = {
            "role": "user",
            "content": msg.content
        };
        const result = await updateLog(newMsg);  // since updateLog is async

        // test
        console.log("result", result);

    } catch (err) {
        console.error("error: ", err);
        return new Response(JSON.stringify({ result: "error", messaage: "invalid"}), {status: 400});

    }
}


/**
 * This function update conversation history, so the history can be sent to ChatGPT API
 * to continue the conversation (so that ChatGPT can remember the content)
 * @param {*} msg : JSON, the text user typed in the text box that can inputted into ChatGPT API
 * @returns : result of updating conv_log.json
 */
async function updateLog (msg) {
    try{
        const history = await fs.readFile(logPath);
        const jsonHistory = JSON.parse(history);

        // test
        console.log("jsonHistory: ", jsonHistory);

        jsonHistory.message.push({
            "role": "user",
            "content": msg.content
        });

        await fs.writeFile(logPath, JSON.stringify(jsonHistory, null, 4), "utf-8");

        return new Response(JSON.stringify({result: "OK", message: "msg saved!"}), {
            status: 200,
            headers: {"content-type": "application/json"}
        });
    } catch (err) {
        return new Response(JSON.stringify({result: "error", message: "invalid json data"}), {status: 500});
    }
      
}