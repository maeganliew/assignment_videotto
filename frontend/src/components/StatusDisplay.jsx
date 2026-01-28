import "./StatusDisplay.css";

function StatusDisplay({ status }) {
  const getStatusConfig = () => {
    switch (status) {
      case "idle":
        return {
          color: "#64748b",
          icon: "○",
          text: "Ready to analyze",
        };
      case "processing":
        return {
          color: "#3b82f6",
          icon: "◌",
          text: "Analyzing video...",
          animate: true,
        };
      case "completed":
        return {
          color: "#10b981",
          icon: "✓",
          text: "Analysis complete",
        };
      case "error":
        return {
          color: "#ef4444",
          icon: "✕",
          text: "Error occurred",
        };
      default:
        return {
          color: "#64748b",
          icon: "○",
          text: status,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="status-display">
      <div className="status-content">
        <span
          className={`status-icon ${config.animate ? "animate" : ""}`}
          style={{ color: config.color }}
        >
          {config.icon}
        </span>
        <span className="status-text" style={{ color: config.color }}>
          {config.text}
        </span>
      </div>
    </div>
  );
}

export default StatusDisplay;
