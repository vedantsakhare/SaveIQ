import React, { useState } from "react";

export default function Settings({ onNavigate }) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState("INR");

  const handleReset = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset your local SaveIQ data?"
    );

    if (!confirmed) return;

    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="page settings-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">PREFERENCES</p>
          <h1>Settings</h1>
          <p>Customize your SaveIQ experience.</p>
        </div>

        <button onClick={() => onNavigate?.("home")}>
          Back to Home
        </button>
      </div>

      <div className="settings-card">
        <div className="settings-section">
          <h2>Preferences</h2>

          <div className="setting-row">
            <div>
              <strong>Notifications</strong>
              <span>Receive reminders about your savings goals.</span>
            </div>

            <button
              className={`toggle ${notifications ? "active" : ""}`}
              onClick={() => setNotifications((value) => !value)}
              aria-label="Toggle notifications"
            >
              <span />
            </button>
          </div>

          <div className="setting-row">
            <div>
              <strong>Dark Mode</strong>
              <span>Use a darker appearance for SaveIQ.</span>
            </div>

            <button
              className={`toggle ${darkMode ? "active" : ""}`}
              onClick={() => setDarkMode((value) => !value)}
              aria-label="Toggle dark mode"
            >
              <span />
            </button>
          </div>

          <div className="setting-row">
            <div>
              <strong>Currency</strong>
              <span>Currency used throughout the application.</span>
            </div>

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h2>AI Assistant</h2>

          <div className="info-box">
            <strong>SaveIQ AI</strong>
            <p>
              AI insights use the financial information you provide to
              generate educational savings-planning suggestions.
            </p>
          </div>
        </div>

        <div className="settings-section danger-section">
          <h2>Data</h2>

          <button className="danger-button" onClick={handleReset}>
            Reset Local Data
          </button>

          <p>
            This removes SaveIQ data stored locally in this browser.
          </p>
        </div>

        <div className="settings-footer">
          <span>SaveIQ</span>
          <span>Personal savings planning</span>
        </div>
      </div>
    </div>
  );
}
