/**
 * This file utilize ChatGPT API
 * User type in the text bar and send it and the reply by ChatGPT will be printed on the console.
 * Conversation history will be svaed in /public/chat/conv_log.json
 * @returns
 */

"use client"; // client component, so that react hooks can be used

// useEffect -> API request, useState -> save data status
import { useEffect, useState } from "react";

/**
 * 1. Get user info
 * 2. Start chatting
 */
export default function chatPage() {
  const [data, setData] = useState(null); // save json data from chat/user_info.json
  const [formData, setFormData] = useState({
    // save user input from API
    user_name: "",
    user_email: "",
    user_inst: "",
  });

  // useEffect only run at the first time/loading
  useEffect(() => {
    fetch("/api/chat") // sent GET request
      .then((res) => res.json()) // explain json reply
      .then((data) => setData(data)) // update data status
      .catch((err) => console.error("API error: ", err));
  }, []);

  // submit form, sent POST request and upload formData to API
  const handleSubmit = async (e) => {
    e.preventDefault(); // don't refresh the page

    if (!formData.user_name || !formData.user_email || !formData.user_inst) {
      alert("Please fill in all fields!");
      return;
    }

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // set header as json
      body: JSON.stringify(formData), // turn formData to json format
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Server error:", res.status, errorText);
      alert(`Error: ${res.status} - Unable to save data`);
      return;
    }

    const result = await res.json();
    alert(result.message);
  };

  // show lastest infomation on the console
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
      <h2>User Information</h2>

      {/* GET button */} 
      <button
        onClick={() =>
          fetch("/api/chat")
            .then((res) => res.json())
            .then(setData)
        }
      >
        GET intial user information
      </button>

      <hr />

      {/* show the lastest user info */}
      {data && data.userInfo ? (
        <div style={{margin: "10px"}}>
          <p>User Name: {data.userInfo.name}</p>
          <p>User email: {data.userInfo.email}</p>
          <p>User institution: {data.userInfo.institution}</p>
        </div>
      ) : (
        <p>Loadind data... </p>
      )}

      <hr />

      {/* user enter info, update user_info.json */}
      <h2>Update User Information</h2>
      <form onSubmit={handleSubmit}>  {/* when from is submitted, run handleSubmit (sent POST) */}
        <p>User name: 
          <input type="text" value={formData.user_name} onChange={(e) => setFormData({ ...formData, user_name: e.target.value})} />
        </p>
        <p>User email: 
          <input type="text" value={formData.user_email} onChange={(e) => setFormData({ ...formData, user_email: e.target.value})} />
        </p>
        <p>institution
          <select
            value={formData.user_inst} onChange={(e) => setFormData({ ... formData, user_inst: e.target.value})}>
              <option value=""> --- choose an institution --- </option>
              <option value="IGS">IGS</option>
              <option value="NTUST">NTUST</option>
          </select>
        </p>
        <button type="submit">UPLOAD</button>
      </form>
    </div>
  );
}
