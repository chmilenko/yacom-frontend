import { useError } from "../Core/Context/ErrorContext";

export const ErrorDisplay = () => {
  const { errors, removeError, isOnline, addError } = useError();

  if (!isOnline) {
    addError({
      id: "no-internet",
      message: "No Internet Connection",
      details: "Please check your network settings and try again",
      severity: "critical",
      timestamp: Date.now(),
    });
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "white",
          zIndex: 9999,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2>🌐 No Internet Connection</h2>
        <p>Please check your network settings and try again</p>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 1000,
      }}
    >
      {errors.map((error) => (
        <div
          key={error.id}
          style={{
            background: error.severity === "critical" ? "#ff4444" : "#ffbb33",
            color: "white",
            padding: "10px",
            margin: "5px",
            borderRadius: "5px",
            minWidth: "300px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>{error.message}</strong>
            <button
              onClick={() => removeError(error.id)}
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
          <div>{error.details}</div>
          <small>{new Date(error.timestamp).toLocaleTimeString()}</small>
        </div>
      ))}
    </div>
  );
};
