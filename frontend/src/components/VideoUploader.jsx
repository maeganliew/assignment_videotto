import { useState } from "react";
import "./VideoUploader.css";

function VideoUploader({ onSubmit, disabled }) {
  const [selectedTab, setSelectedTab] = useState("file");
  const [file, setFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [fileName, setFileName] = useState("");

  const handleSubmit = () => {
    if (selectedTab === "file" && file) {
      onSubmit({ type: "file", file });
    } else if (selectedTab === "youtube" && youtubeUrl) {
      onSubmit({ type: "youtube", url: youtubeUrl });
      setYoutubeUrl("");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleGoogleDrivePicker = () => {
    window.google.accounts.oauth2.initTokenClient({
      client_id: 'YOUR_GOOGLE_CLIENT_ID',
      scope: 'https://www.googleapis.com/auth/drive.readonly',
      callback: (response) => {
        if (response.access_token) {
          loadGooglePicker(response.access_token);
        }
      },
    }).requestAccessToken();
  };

  const loadGooglePicker = (accessToken) => {
    const picker = new window.google.picker.PickerBuilder()
      .addView(window.google.picker.ViewId.DOCS_VIDEOS)
      .setOAuthToken(accessToken)
      .setCallback((data) => {
        if (data.action === window.google.picker.Action.PICKED) {
          const file = data.docs[0];
          onSubmit({ type: "googledrive", fileId: file.id });
        }
      })
      .build();
    picker.setVisible(true);
  };

  const isSubmitDisabled = disabled ||
    (selectedTab === "file" && !file) ||
    (selectedTab === "youtube" && !youtubeUrl);

  return (
    <div className="uploader-card">
      <div className="tabs">
        <button
          className={`tab ${selectedTab === "file" ? "active" : ""}`}
          onClick={() => setSelectedTab("file")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
            <polyline points="13 2 13 9 20 9" />
          </svg>
          File Upload
        </button>
        <button
          className={`tab ${selectedTab === "youtube" ? "active" : ""}`}
          onClick={() => setSelectedTab("youtube")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          YouTube
        </button>
      </div>

      <div className="tab-content">
        {selectedTab === "file" && (
          <div className="input-section">
            <label className="file-input-label">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                disabled={disabled}
              />
              <div className="file-input-display">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span className="file-input-text">
                  {fileName || "Click to select a video file"}
                </span>
                {fileName && <span className="file-selected">✓ File selected</span>}
              </div>
            </label>
          </div>
        )}

        {selectedTab === "youtube" && (
          <div className="input-section">
            <input
              type="text"
              placeholder="Paste YouTube URL (e.g., https://youtube.com/watch?v=...)"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              disabled={disabled}
              className="url-input"
            />
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitDisabled}
        className="submit-button"
      >
        {disabled ? "Processing..." : "Analyze Video"}
      </button>
    </div>
  );
}

export default VideoUploader;
