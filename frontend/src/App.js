import { useState, useEffect } from "react";

function App() {
  console.log("App rendered");

  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [topClips, setTopClips] = useState([]);

  const fetchStatus = async () => {
    const res = await fetch("http://localhost:8000/status");
    const data = await res.json();
    setStatus(data.state);

    if (data.state === "completed") {
      fetchTopClips();
    }
  };

  const fetchTopClips = async () => {
    const res = await fetch("http://localhost:8000/topclips");
    const data = await res.json();
    setTopClips(data);
  };

  useEffect(() => {
    setStatus("idle");
    setTopClips([]);
    const interval = setInterval(fetchStatus, 500);
    return () => clearInterval(interval);
  }, []);

  const uploadVideo = async () => {
    if (!file) return;
    setStatus("processing");
    setTopClips([]);

    const formData = new FormData();
    formData.append("file", file);

    await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    });
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Video Clip Analyzer</h2>

      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={uploadVideo}>Upload Video</button>

      <p>Status: <strong>{status}</strong></p>
      {topClips.length > 0 && (
      <div>
        <h3>Top 3 Clips</h3>
        <ul>
          {topClips.map((clip, index) => (
            <li key={index}>
              <p><strong>Clip {index + 1}</strong></p>
              <p>Start: {clip.start.toFixed(1)}s</p>
              <p>End: {clip.end.toFixed(1)}s</p>
              <p>Reason: {clip.reason}</p>
            </li>
          ))}
        </ul>
      </div>
    )}
    </div>
  );
}

export default App;
