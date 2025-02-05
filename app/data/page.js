/**
 * This file is used to simulate data.html
 */

"use client";
import { useEffect, useState } from "react";

export default function DataPage() {
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({
    app_id: "",
    app_name: "",
    app_version: "",
    app_author: "",
    app_remark: "",
  });

  // get data (GET)
  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("API Error:", err));
  }, []);

  // post data (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      console.error("Server error:", res.status);
      alert(`Error: ${res.status} - Unable to save data`);
      return;
    }

    const result = await res.json();
    alert(result.message);
  };

  // show on the console
  return (
    <div>
      <h1>DATA : API</h1>
      <h2>API : GET</h2>
      <button
        onClick={() =>
          fetch("/api/data")
            .then((res) => res.json())
            .then(setData)
        }
      >
        GET
      </button>
      <hr />

      {data && data.appInfo ? (
        <div>
          <p>data[id]: {data.appInfo.id}</p>
          <p>data[name]: {data.appInfo.name}</p>
          <p>data[version]: {data.appInfo.version}</p>
          <p>data[author]: {data.appInfo.author}</p>
          <p>data[remark]: {data.appInfo.remark}</p>
        </div>
      ) : (
        <p>Loading data...</p>
      )}

      <hr />
      <h2>API : POST</h2>
      <form onSubmit={handleSubmit}>
        <p>
          APP_ID:
          <input
            type="number"
            value={formData.app_id}
            onChange={(e) =>
              setFormData({ ...formData, app_id: e.target.value })
            }
          />
        </p>
        <p>
          APP_NAME:
          <input
            type="text"
            value={formData.app_name}
            onChange={(e) =>
              setFormData({ ...formData, app_name: e.target.value })
            }
          />
        </p>
        <p>
          APP_VERSION:
          <input
            type="text"
            value={formData.app_version}
            onChange={(e) =>
              setFormData({ ...formData, app_version: e.target.value })
            }
          />
        </p>
        <p>
          APP_AUTHOR:
          <input
            type="text"
            value={formData.app_author}
            onChange={(e) =>
              setFormData({ ...formData, app_author: e.target.value })
            }
          />
        </p>
        <p>
          APP_REMARK:
          <input
            type="text"
            value={formData.app_remark}
            onChange={(e) =>
              setFormData({ ...formData, app_remark: e.target.value })
            }
          />
        </p>
        <button type="submit">POST</button>
      </form>
    </div>
  );
}
