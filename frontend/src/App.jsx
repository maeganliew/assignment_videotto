import { useState, useEffect } from "react";
import VideoUploader from "./components/VideoUploader";
import StatusDisplay from "./components/StatusDisplay";
import ClipResults from "./components/ClipResults";
import "./App.css";

function App() {
  const [status, setStatus] = useState("idle");
  const [topClips, setTopClips] = useState([]);

  const fetchStatus = async () => {
    try {
      const res = await fetch("http://localhost:8000/status");
      const data = await res.json();
      setStatus(data.state);

      if (data.state === "completed") {
        fetchTopClips();
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  const fetchTopClips = async () => {
    try {
      const res = await fetch("http://localhost:8000/topclips");
      const data = await res.json();
      setTopClips(data);
    } catch (error) {
      console.error("Error fetching clips:", error);
    }
  };

  useEffect(() => {
    setStatus("idle");
    setTopClips([]);
    const interval = setInterval(fetchStatus, 500);
    return () => clearInterval(interval);
  }, []);

  const handleVideoSubmit = async (source) => {
    setStatus("processing");
    setTopClips([]);

    try {
      if (source.type === "file") {
        const formData = new FormData();
        formData.append("file", source.file);
        await fetch("http://localhost:8000/upload", {
          method: "POST",
          body: formData,
        });
      } else if (source.type === "youtube") {
        await fetch("http://localhost:8000/upload_youtube", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: source.url }),
        });
      }
    } catch (error) {
      console.error("Error submitting video:", error);
      setStatus("error");
    }
  };

  return (
    <div className="app">
      <div className="header">
        <div className="title-container">
          <h1 className="title">Video Clip Analyzer</h1>
          <p className="subtitle">Upload your video and discover the most engaging moments</p>
        </div>
      </div>

      <div className="container">
        <VideoUploader onSubmit={handleVideoSubmit} disabled={status === "processing"} />
        <StatusDisplay status={status} />
        <ClipResults clips={topClips} />
      </div>
    </div>
  );
}

export default App;
