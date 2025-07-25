// Component to display machine failure prediction results
function PredictionResult({ predictionResult, onCloseClick }) {
  console.log("🔍 PredictionResult received:", predictionResult);

  // Función para extraer valores de manera segura según tu API
  const getPredictionValue = () => {
    return predictionResult.prediction || 0;
  };

  const getProbability = () => {
    return predictionResult.probability || 0;
  };

  const getMachineId = () => {
    return predictionResult.machine_id || "Unknown";
  };

  const getStatus = () => {
    return predictionResult.status || "unknown";
  };

  // Get color based on prediction value (1 = failure, 0 = normal)
  const getPredictionColor = (predictionValue) => {
    return predictionValue === 1 ? "#ef4444" : "#22c55e";
  };

  // Get color based on probability
  const getProbabilityColor = (probability) => {
    if (probability < 0.3) return "#22c55e"; // Low - green
    if (probability < 0.7) return "#f59e0b"; // Medium - yellow
    return "#ef4444"; // High - red
  };

  // Format probability as percentage
  const formatProbability = (probability) => {
    if (isNaN(probability) || probability === null || probability === undefined) {
      return "Unknown";
    }
    return `${(probability * 100).toFixed(1)}%`;
  };

  const predictionValue = getPredictionValue();
  const probability = getProbability();
  const machineId = getMachineId();
  const status = getStatus();

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>📊 Failure Prediction Result</h2>
          <button className="close-btn" onClick={onCloseClick}>
            ×
          </button>
        </div>

        {/* DEBUG: Mostrar la respuesta completa */}
        <div style={{ 
          background: "#f0f0f0", 
          padding: "10px", 
          margin: "10px 0", 
          borderRadius: "4px",
          fontSize: "12px",
          fontFamily: "monospace"
        }}>
          <strong>DEBUG - Raw API Response:</strong>
          <pre>{JSON.stringify(predictionResult, null, 2)}</pre>
        </div>

        <div className="prediction-info">
          <div className="info-item">
            <span>Machine ID:</span>
            <strong>{machineId}</strong>
          </div>

          <div className="info-item">
            <span>API Status:</span>
            <strong style={{ color: status === "success" ? "#22c55e" : "#ef4444" }}>
              {status.toUpperCase()}
            </strong>
          </div>

          <div className="info-item">
            <span>Prediction Result:</span>
            <strong style={{ color: getPredictionColor(predictionValue) }}>
              {predictionValue === 1 ? "⚠️ FAILURE DETECTED" : "✅ NORMAL OPERATION"}
            </strong>
          </div>

          <div className="info-item">
            <span>Failure Probability:</span>
            <strong style={{ color: getProbabilityColor(probability) }}>
              {formatProbability(probability)}
            </strong>
          </div>

          <div className="info-item">
            <span>Maintenance Recommended:</span>
            <strong style={{ color: predictionValue === 1 ? "#ef4444" : "#22c55e" }}>
              {predictionValue === 1 ? "YES - IMMEDIATE ACTION REQUIRED" : "NO"}
            </strong>
          </div>

          {predictionValue === 1 && (
            <div className="recommendations">
              <h4>⚠️ Recommended Actions (High Risk Detected):</h4>
              <ul>
                <li>Schedule immediate maintenance inspection</li>
                <li>Check all machine parameters and sensors</li>
                <li>Review recent maintenance logs</li>
                <li>Consider temporary shutdown if risk is critical</li>
                <li>Monitor machine closely until maintenance is performed</li>
              </ul>
            </div>
          )}

          {predictionResult.features_used && (
            <div className="recommendations">
              <h4>📊 Features Analyzed:</h4>
              <ul>
                {predictionResult.features_used.map((feature, index) => (
                  <li key={index}>{feature.replace('_', ' ').toUpperCase()}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PredictionResult;