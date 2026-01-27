import { useState, useEffect } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");

  const fetchStatus = async () => {
    const res = await fetch("http://localhost:8000/status");
    const data = await res.json();
    setStatus(data.state);
  };

  useEffect(() => {
    const interval = setInterval(fetchStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const uploadVideo = async () => {
    if (!file) return;

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
    </div>
  );
}

export default App;
