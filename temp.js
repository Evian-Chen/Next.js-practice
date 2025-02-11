/**
 * This file utilizes ChatGPT API.
 * Users can type in the text bar and send messages.
 * The conversation history is saved in /public/chat/conv_log.json.
 */

"use client";

import { useEffect, useState } from "react";
import { Init_log } from "../api/chat/route";

export default function ChatPage() {
  useEffect(() => {
    Init_log(); // Initialize conversation history
  }, []); // Only run Init_log once when the page loads

  // Message input state
  const [input, setInput] = useState({
    role: "user",
    content: "",
  });

  // Parameter settings state
  const [paramData, setParamData] = useState({
    model: "gpt-4o", // Default model
    n: 1,
    max_tokens: 50,
  });

  // Send user message
  const sendMsg = async () => {
    if (!input.content) {
      alert("Cannot send an empty message");
      return;
    }

    try {
      const result = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!result.ok) {
        alert("Error sending message");
        return;
      }

      const r = await result.json();
      alert(r.message);
      setInput({ ...input, content: "" }); // Clear input box
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Fetch error.");
    }
  };

  // Save parameter settings
  const setupParam = async () => {
    try {
      const res = await fetch("/api/chat/setup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(paramData),
      });

      if (!res.ok) {
        alert("Error saving parameters");
        return;
      }

      const result = await res.json();
      alert(result.message);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Fetch error.");
    }
  };

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

      {/* Layout container (¥ª¥k¨Ã±Æ) */}
      <div
        style={{
          display: "flex",
          width: "80%",
          maxWidth: "800px",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
        }}
      >
        {/* Left Panel - Parameter Settings */}
        <div
          className="paramBox"
          style={{
            width: "40%",
            padding: "15px",
            border: "1px solid white",
            borderRadius: "8px",
            textAlign: "left",
          }}
        >
          <h3>ChatGPT Settings</h3>

          <div style={{ marginBottom: "10px" }}>
            <label>Model: </label>
            <select
              value={paramData.model}
              onChange={(e) => setParamData({ ...paramData, model: e.target.value })}
              style={{ padding: "5px", marginLeft: "10px", width: "100%" }}
            >
              <option value="gpt-4o">GPT-4o</option>
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5">GPT-3.5</option>
            </select>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>n (Responses): </label>
            <input
              type="number"
              value={paramData.n}
              onChange={(e) => setParamData({ ...paramData, n: Number(e.target.value) })}
              style={{ padding: "5px", marginLeft: "10px", width: "100%" }}
            />
          </div>

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

        {/* Right Panel - Chat Input */}
        <div
          style={{
            width: "55%",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <h3>Chat</h3>
          <input
            type="text"
            placeholder="Type something..."
            value={input.content}
            onChange={(e) => setInput({ ...input, content: e.target.value })}
            style={{ width: "100%", padding: "8px" }}
          />
          <button type="button" onClick={sendMsg} style={{ padding: "8px 12px", width: "100%" }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
