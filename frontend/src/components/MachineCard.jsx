// Component to display individual machine information in a card format
function MachineCard({ machineData, predictionStatus, lastPrediction, onEditClick, onDeleteClick, onPredictClick }) {
  // Get color based on prediction status
  const getStatusColor = (status) => {
    switch (status) {
      case "failure":
        return "#ef4444" // Red for failure
      case "normal":
        return "#22c55e" // Green for normal
      case "unknown":
      default:
        return "#6b7280" // Gray for unknown
    }
  }

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case "failure":
        return "⚠️ FAILURE RISK"
      case "normal":
        return "✅ NORMAL"
      case "unknown":
      default:
        return "❓ CHECKING..."
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified"
    return new Date(dateString).toLocaleDateString()
  }

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return ""
    return new Date(timestamp).toLocaleString()
  }

  // Get color based on error code
  const getErrorCodeColor = (errorCode) => {
    switch (errorCode?.toUpperCase()) {
      case "NONE":
        return "#22c55e"
      case "OVERHEAT":
        return "#ef4444"
      case "LOW_OIL":
        return "#f59e0b"
      case "HIGH_VIBRATION":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  return (
    <div className={`card ${predictionStatus === "failure" ? "card-failure" : ""}`}>
      <div className="card-header">
        <h3>{machineData.name}</h3>
        <div className="status-badges">
          <span className="status prediction-status" style={{ backgroundColor: getStatusColor(predictionStatus) }}>
            {getStatusText(predictionStatus)}
          </span>
          <span className="status error-code" style={{ backgroundColor: getErrorCodeColor(machineData.error_code) }}>
            {machineData.error_code || "NONE"}
          </span>
        </div>
      </div>

      <div className="card-body">
        <p>
          <strong>ID:</strong> {machineData.machine_id}
        </p>
        <p>
          <strong>Temperature:</strong> {machineData.temperature}°C
        </p>
        <p>
          <strong>Vibration:</strong> {machineData.vibration}
        </p>
        <p>
          <strong>Pressure:</strong> {machineData.pressure} PSI
        </p>
        <p>
          <strong>Oil Level:</strong> {machineData.oil_level}%
        </p>
        <p>
          <strong>Last Maintenance:</strong> {formatDate(machineData.last_maintenance)}
        </p>

        {/* Mostrar información de la última predicción */}
        {lastPrediction && (
          <div className="prediction-info">
            <p>
              <strong>Last Prediction:</strong> {formatTimestamp(lastPrediction.timestamp)}
            </p>
            <p>
              <strong>Result:</strong>
              <span
                style={{
                  color: lastPrediction.prediction.prediction === 1 ? "#ef4444" : "#22c55e",
                  fontWeight: "bold",
                }}
              >
                {lastPrediction.prediction.prediction === 1 ? " FAILURE" : " NORMAL"}
              </span>
            </p>
            <p>
              <strong>Probability:</strong>
              <span
                style={{
                  color: lastPrediction.prediction.probability > 0.7 ? "#ef4444" : "#22c55e",
                  fontWeight: "bold",
                }}
              >
                {(lastPrediction.prediction.probability * 100).toFixed(1)}%
              </span>
            </p>
          </div>
        )}      

        <div className="card-actions">
          <button className="btn btn-small" onClick={onPredictClick}>
            📊 Predict
          </button>
          <button className="btn btn-small" onClick={onEditClick}>
            ✏️ Edit
          </button>
          <button className="btn btn-small btn-danger" onClick={onDeleteClick}>
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default MachineCard