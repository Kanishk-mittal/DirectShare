import React, { useState, useEffect } from "react";
import UploadPage from "./UploadPage";
import DownloadPage from "./DownloadPage";
import "./Theme.css"; // Import the new theme styles

// Theme switcher component
const ThemeSwitcher = ({ theme, toggleTheme }) => {
  return (
    <div className="theme-switcher">
      <button onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
        <span className="theme-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
      </button>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState("download");
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'

  // Function to toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = `${newTheme}-theme`;
  };

  // Set initial theme
  useEffect(() => {
    document.body.className = `${theme}-theme`;
  }, [theme]);

  return (
    <div className="container">
      <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
      <h1>DirectShare - P2P File Sharing</h1>

      {/* Tabs for navigation */}
      <div className="tabs">
        <label className={`tab-label ${activeTab === "download" ? "active" : ""}`}>
          <input
            type="radio"
            value="download"
            checked={activeTab === "download"}
            onChange={(e) => setActiveTab(e.target.value)}
          />
          Download
        </label>
        <label className={`tab-label ${activeTab === "upload" ? "active" : ""}`}>
          <input
            type="radio"
            value="upload"
            checked={activeTab === "upload"}
            onChange={(e) => setActiveTab(e.target.value)}
          />
          Upload
        </label>
      </div>

      {/* Conditional rendering based on active tab */}
      {activeTab === "download" ? <DownloadPage /> : <UploadPage />}
    </div>
  );
}
