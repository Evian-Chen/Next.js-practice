/**
 * This file utilize ChatGPT API
 * User type in the text bar and send it and the reply by ChatGPT will be printed on the console.
 * Conversation history will be svaed in /public/chat/conv_log.json
 */

"use client";

import { useEffect, useState } from "react";
import Form from "next/form";

export default function chatPage() {
  // get input message
  const [input, setInput] = useState("");

  // set standard message format (user, content)
  const [messages, setMessages] = useState([]);

  const [paramData, setParamData] = useState({
    model:  "gpt-4o-mini",
    n: 1,
    max_tokens: 10,
  });

  // Get conversation history as long as chat page load in
  useEffect(() => {
    fetch("/api/chat") // sent GET request to backend api
      .then((res) => res.json()) // turn api response to json format
      .then((data) => setMessages(data)) // update messages status
      .catch((err) => console.log("Fetch error: ", err));
  }, []); // only run once

  // this return the user input message
  const sendMsg = async () => {
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
        alert("error sending message");
        return;
      }

      const newMessage = await result.json();
      setMessages([ ...newMessage, {role: "user", content: input}])
      setInput(""); // make sure the text box is empty
      
    } catch (err) {
      console.error("fetch error: ", err);
      alert("Fetch error.");
    }
  };

  // this check if the user change the param setup
  const setupParam = async () => {
    return;
  };

  return (
    <div className="chat-container">
      <h2>Welcome to ChatGPT API</h2>
      <p>Type something in the text box to chat with ChatGPT</p>

      <div className="layout-container">

        {/* left panel, params setting */}
        <div className="param-box">
          <h3>ChatGPT Settings</h3>

          {/* model selector */}
          <div style={{ marginBottom: "10px" }}>
            <label>Model: </label>
            <select
              value={paramData.model}
              onChange={(e) =>
                setParamData({ ...paramData, model: e.target.value })
              }
              style={{ padding: "5px", marginLeft: "10px", width: "100%" }}
            >
              <option value="gpt-4o-mini">gpt-4o-mini</option>
              <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
            </select>
          </div>

          {/* n reply */}
          <div style={{ marginBottom: "10px" }}>
            <label>n (Responses): </label>
            <input
              type="number"
              value={paramData.n}
              onChange={(e) => setParamData({ ...paramData, n: Number(e.target.value) })}
              style={{ padding: "5px", marginLeft: "10px", width: "100%" }}
            />
          </div>

          {/* max tokens */}
          <div style={{ marginBottom: "10px" }}>
            <label>Max Tokens: </label>
            <input
              type="number"
              value={paramData.max_tokens}
              onChange={(e) => setParamData({ ...paramData, max_tokens: Number(e.target.value) })}
              style={{ padding: "5px", marginLeft: "10px", width: "100%" }}
            />
          </div>

          <button type="button" onClick={setupParam} style={{ padding: "8px 12px", marginTop: "10px", width: "100%" }}>
            Save Settings
          </button>

        </div>

        {/* right panel, message input box */}
        <div className="chat-box">
          <h3>Chat</h3>
          <input
            type="text"
            placeholder="Type something..."
            value={input.content}
            onChange={(e) => setInput({ ...input, content: e.target.value })}
            style={{ width: "100%", padding: "8px" }}
          />
          <button
            type="button"
            onClick={sendMsg}
            style={{ padding: "8px 12px", width: "100%" }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
