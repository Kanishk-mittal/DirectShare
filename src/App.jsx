import React, { useState } from "react";
import UploadPage from "./UploadPage";
import DownloadPage from "./DownloadPage";

export default function App() {
  const [activeTab, setActiveTab] = useState("download");

  return (
    <div style={{ padding: "20px" }}>
      <h1>DirectShare - P2P File Sharing</h1>

      {/* Radio buttons for tab selection */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "20px" }}>
          <input
            type="radio"
            value="download"
            checked={activeTab === "download"}
            onChange={(e) => setActiveTab(e.target.value)}
            style={{ marginRight: "5px" }}
          />
          Download Files
        </label>
        <label>
          <input
            type="radio"
            value="upload"
            checked={activeTab === "upload"}
            onChange={(e) => setActiveTab(e.target.value)}
            style={{ marginRight: "5px" }}
          />
          Upload & Share Files
        </label>
      </div>

      {/* Conditional rendering based on active tab */}
      {activeTab === "download" ? <DownloadPage /> : <UploadPage />}
    </div>
  );
}
