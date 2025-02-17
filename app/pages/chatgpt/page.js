/**
 * This file utilize ChatGPT API
 * User type in the text bar and send it and the reply by ChatGPT will be printed on the console.
 * Conversation history will be svaed in /public/chat/conv_log.json
 */

"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./chat.module.css";

export default function chatPage() {
  const [input, setInput] = useState({
    role: "user",
    content: "",
  });
  const [messages, setMessages] = useState([]);
  const [paramData, setParamData] = useState({
    model: "gpt-4o-mini",
    n: 1,
    max_tokens: 50,
    temperature: 0.7,
    top_p: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
    stream: false,
    logit_bias: null,
    stop: null,
  });
  const [tokenInfo, setTokenInfo] = useState({
    prompt: 0,
    completion: 0,
    total: 0,
  });
  const [isSaved, setIsSaved] = useState(false);
  const isManualChange = useRef(false);

  useEffect(() => {
    fetch("/api/openai")
      .then((res) => res.json())
      .then((data) => setTokenInfo(data))
      .catch((err) => console.error("err", err));
  }, [messages]);

  // Listen paramData
  useEffect(() => {
    if (isManualChange.current) {
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
      const result = await fetch("/api/openai", {
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

      fetch("/api/openai")
      .then((res) => res.json())
      .then((data) => setTokenInfo(data))
      .catch((err) => console.error("Error fetching token info:", err));
      
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
    <div className={styles.chatContainer}>
      <div className={styles.left}>
        <h2>Welcome to ChatGPT API</h2>
        {/* <p>Type something in the text box to chat with ChatGPT</p> */}

        <div className={styles.settingsContainer}>
          <h4>ChatGPT Settings</h4>

          {/* left panel, params setting */}
          <div className={styles.paramBox}>
            {/* model selector */}
            <label>Model</label>
            <select
              value={paramData.model}
              onChange={(e) =>
                setParamData({ ...paramData, model: e.target.value })
              }
            >
              <option value="gpt-4o-mini">gpt-4o-mini</option>
              <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
            </select>

            {/* n reply */}
            <label>n Responses</label>
            <input
              type="number"
              value={paramData.n}
              onChange={(e) =>
                setParamData({ ...paramData, n: Number(e.target.value) })
              }
            />

            {/* max tokens */}
            <label>Max Tokens</label>
            <input
              type="number"
              value={paramData.max_tokens}
              onChange={(e) =>
                setParamData({
                  ...paramData,
                  max_tokens: Number(e.target.value),
                })
              }
            />

            <button
              type="button"
              onClick={setupParam}
              className={styles.paramButton}
            >
              {isSaved ? "Setting Saved" : "Save Settings"}
            </button>
          </div>
        </div>

        <div className={styles.tokens}>
          <p>prompt tokens: {tokenInfo.prompt}</p>
          <p>completion tokens: {tokenInfo.completion}</p>
          <p>total tokens: {tokenInfo.total}</p>
        </div>
      </div>

      <div className={styles.right}>
        {/* right panel, message input box */}
        <div className={styles.chatBox}>
          {/* <h3>Chat</h3> */}
          <input
            type="text"
            placeholder="Type something..."
            value={input.content || ""}
            onChange={(e) => setInput({ ...input, content: e.target.value })}
            className={styles.textBar}
          />
          <button type="button" onClick={sendMsg} className={styles.send}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
