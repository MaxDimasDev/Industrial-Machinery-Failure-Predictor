// Componente para mostrar alertas de máquinas en falla
function AlertPanel({ failedMachines, onDismiss }) {
  return (
    <div className="alert-panel">
      <div className="alert-header">
        <div className="alert-title">
          ⚠️ <strong>CRITICAL ALERT</strong> - Machines Requiring Immediate Attention
        </div>
        <button className="alert-dismiss" onClick={onDismiss}>
          ×
        </button>
      </div>

      <div className="alert-content">
        <div className="alert-summary">{failedMachines.length} machine(s) detected with high failure probability</div>

        <div className="failed-machines-list">
          {failedMachines.map((machine, index) => (
            <div key={index} className="failed-machine-item">
              <div className="machine-info">
                <strong>{machine.machine_name}</strong> (ID: {machine.machine_id})
              </div>
              <div className="failure-details">
                <span className="failure-probability">
                  Failure Risk: {(machine.failure_probability * 100).toFixed(1)}%
                </span>
                {machine.estimated_hours && (
                  <span className="estimated-time">Est. Time to Failure: {machine.estimated_hours}h</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="alert-actions">
          <strong>Recommended Actions:</strong>
          <ul>
            <li>Schedule immediate maintenance inspection</li>
            <li>Check machine parameters and sensors</li>
            <li>Review maintenance logs</li>
            <li>Consider temporary shutdown if risk is critical</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AlertPanel