/**
 * This file utilize ChatGPT API
 * User type in the text bar and send it and the reply by ChatGPT will be printed on the console.
 * Conversation history will be svaed in /public/chat/conv_log.json
 */

"use client";

import { useState } from "react";
import Form from 'next/form';
import { Init_log } from "../api/chat/route";

export default function chatPage() {
  Init_log();  // initialize conversation history

  const [input, setInput] = useState({
    role: "user",
    content: "",
  });
 
  // this return the user input message
  const sentMsg = async () => {
      if (!input.content) {
          alert("Can not sent empty message");
          return;
      }

      try {
        const result = await fetch("/api/chat", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(input),
        });

        if (!result.ok) {
            alert("error");
            return;
        }

        const r = await result.json();
        alert(r.message);
        setInput({ ...input, content: ""});  // make sure the text bax is empty
      } catch (err) {
        console.error("fetch error: ", err);
        alert("Fetch error.");
      }
   };

  // this check if the user change the param setup
  const setupParam = async() => {
    return;
  }
  

  return (
    <div
      style={{
        backgroundColor: "black",
        color: "white",
        padding: "20px",
        margin: "5px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <h2>Welcome to ChatGPT API</h2>
      <p>Type something in the text box to chat with ChatGPT</p>

      {/* message input box */}
      <div className="flex w-full">
        <input type="text" 
        placeholder="Type something..." 
        value={input.content}
        onChange={(e) => setInput({ ...input, content: e.target.value})} />
        <button type="button" onClick={sentMsg}>Sent</button>
      </div>

      {/* setup some param */}
      <div class="paramBox">
        <input type="number"/>
        <button typr="button" onClick={setupParam}>save</button>
      </div>
    </div>
  );
}
