/**
 * This file utilize ChatGPT API
 * User type in the text bar and send it and the reply by ChatGPT will be printed on the console.
 * Conversation history will be svaed in /public/chat/conv_log.json
 */

"use client";

import { useEffect, useState, useRef } from "react";

export default function chatPage() {
  const [input, setInput] = useState({
    role: "user",
    content: "",
  });
  const [messages, setMessages] = useState([]);
  const [paramData, setParamData] = useState({
    model: "gpt-4o-mini",
    n: 1,
    max_tokens: 100,
    temperature: 0.7,
    top_p: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
    stream: false,
    logit_bias: null,
    stop: null,
  });
  const [isSaved, setIsSaved] = useState(false);
  const isManualChange = useRef(false);

  // Get conversation history as long as chat page load in
  // useEffect(() => {
  //   fetch("/api/history") // sent GET request to backend api
  //     .then((res) => res.json()) // turn api response to json format
  //     .then((data) => setMessages(data)) // update messages status
  //     .catch((err) => console.log("Fetch error: ", err));
  // }, []); // only run once

  // Listen paramData
  useEffect(() => {
    if (isManualChange.current){
      setIsSaved(false);
    }
  }, [paramData]); // if paramData is change, run setIsSaved

  // this return the user input message
  const sendMsg = async () => {
    if (!input) {
      alert("Can not sent empty message");
      return;
    }

    try {
      const result = await fetch("/api/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!result.ok) {
        alert("error sending message");
        return;
      }

      const newMessage = await result.json();

      // newMessage is not iterable, so use `[newMessage]`
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: input.content },
        newMessage,
      ]);
      setInput({ ...input, content: "" }); // make sure the text box is empty
    } catch (err) {
      console.error("fetch error: ", err);
      alert("Fetch error.");
    }
  };

  // this check if the user change the param setup
  const setupParam = async () => {
    if (!paramData) {
      alert("Make sure to fill all the fields.");
      return;
    }

    try {
      const result = await fetch("/api/settings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(paramData),
      });

      if (!result.ok) {
        alert("Failed to update param");
        console.log("result: ", result);
        return;
      }

      const newParams = await result.json();

      isManualChange.current = false;
      setParamData((prev) => ({
        ...prev,
        ...newParams,
      }));

      // isManualChange.corrent = false;

      // settings saved successfully
      setIsSaved(true);

      setTimeout(() => {
        isManualChange.current = true;
      }, 10);

    } catch (err) {
      console.error("Fetch error: ", err);
      alert("Fetch error");
    }
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
              onChange={(e) =>
                setParamData({ ...paramData, n: Number(e.target.value) })
              }
              style={{ padding: "5px", marginLeft: "10px", width: "100%" }}
            />
          </div>

          {/* max tokens */}
          <div style={{ marginBottom: "10px" }}>
            <label>Max Tokens: </label>
            <input
              type="number"
              value={paramData.max_tokens}
              onChange={(e) =>
                setParamData({
                  ...paramData,
                  max_tokens: Number(e.target.value),
                })
              }
              style={{ padding: "5px", marginLeft: "10px", width: "100%" }}
            />
          </div>

          <button
            type="button"
            onClick={setupParam}
            className={`param-button ${isSaved ? "saved" : "unSaved"}`}
          >
            {isSaved ? "Setting Saved" : "Save Settings"}
          </button>
        </div>

        {/* right panel, message input box */}
        <div className="chat-box">
          <h3>Chat</h3>
          <input
            type="text"
            placeholder="Type something..."
            value={input.content || ""}
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
