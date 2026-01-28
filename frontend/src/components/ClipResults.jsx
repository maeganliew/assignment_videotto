import "./ClipResults.css";

function ClipResults({ clips }) {
  if (clips.length === 0) return null;

  return (
    <div className="results-container">
      <h2 className="results-title">Top Engaging Clips</h2>
      <div className="clips-grid">
        {clips.map((clip, index) => (
          <div key={index} className="clip-card">
            <div className="clip-header">
              <span className="clip-number">#{index + 1}</span>
              <div className="clip-duration">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {clip.start.toFixed(1)}s - {clip.end.toFixed(1)}s
              </div>
            </div>
            <div className="clip-body">
              <p className="clip-reason">{clip.reason}</p>
              <div className="clip-stats">
                <div className="stat">
                  <span className="stat-label">Duration</span>
                  <span className="stat-value">{(clip.end - clip.start).toFixed(1)}s</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClipResults;
