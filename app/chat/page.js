/**
 * This file utilize ChatGPT API
 * User type in the text bar and send it and the reply by ChatGPT will be printed on the console.
 * Conversation history will be svaed in /public/chat/conv_log.json
 */

"use client";

import { useState } from "react";
import Form from 'next/form';

export default function chatPage() {
    const [input, setInput] = useState({
        "role": "user",
        "content": ""
    });

    const sentMsg = async () => {
        if (!input.content) {
            alert("Can't sent empty message");
            return;
        }

        const result = await fetch("/api/chat", {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify(input)
        });

        if (!result.ok) {
            alert("error");
            return;
        }

        const r = await result.json();
        alert(r.message);
    }

    return (
        <div style={{
            backgroundColor: "black",
            color: "white",
            padding: "20px",
            margin: "5px",
            textAlign: "center", 
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px"
        }}>
            <h2>Welcome to ChatGPT API</h2>
            <p>Type something in the text box to chat with ChatGPT</p>

            {/* message input box */}
            <div className="flex w-full">
                <input type="text" placeholder="Type something..." value={input}/>
                <button onClick={sentMsg}>Sent</button>
            </div>


        </div>
    );
}