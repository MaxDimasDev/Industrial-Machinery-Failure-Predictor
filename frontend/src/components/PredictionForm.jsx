import { useState, useEffect } from "react";

// Form component for making failure predictions
function PredictionForm({ selectedMachine, onPredictClick, onCancelClick }) {
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  // Función para convertir fecha a formato YYYY-MM-DD (más robusta)
  const formatDateForAPI = (dateString) => {
    if (!dateString) return getTodayDate();

    try {
      // Crear un objeto Date y extraer solo la parte de la fecha
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
    
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return getTodayDate();
    }
  };

  // Form state with initial values
  const [formInputs, setFormInputs] = useState({
    machine_id: "",
    temperature: 0,
    vibration: 0,
    pressure: 0,
    oil_level: 0,
    error_code: "NONE",
    last_maintenance: getTodayDate(),
    running_hours: 0
  });

  // Load selected machine data
  useEffect(() => {
    if (selectedMachine) {
      setFormInputs({
        machine_id: selectedMachine.machine_id || "",
        temperature: selectedMachine.temperature || 0,
        vibration: selectedMachine.vibration || 0,
        pressure: selectedMachine.pressure || 0,
        oil_level: selectedMachine.oil_level || 0,
        error_code: selectedMachine.error_code || "NONE",
        last_maintenance: formatDateForAPI(selectedMachine.last_maintenance),
        running_hours: 0 // Default to 0 as this is specific to prediction
      });
    }
  }, [selectedMachine]);

  // Handle form submission
  const handleFormSubmit = (event) => {
    event.preventDefault();
    
    // Validate all fields are filled
    const requiredFields = [
      "machine_id", "temperature", "vibration", "pressure", 
      "oil_level", "error_code", "last_maintenance", "running_hours"
    ];
    
    for (const field of requiredFields) {
      if (!formInputs[field] && formInputs[field] !== 0) {
        alert(`All fields are required. Please fill in ${field.replace('_', ' ')}.`);
        return;
      }
    }

    // Convert numeric fields to appropriate types and ensure date format
    const formattedData = {
      machine_id: formInputs.machine_id,
      temperature: parseFloat(formInputs.temperature),
      vibration: parseFloat(formInputs.vibration),
      pressure: parseInt(formInputs.pressure),
      oil_level: parseInt(formInputs.oil_level),
      error_code: formInputs.error_code,
      last_maintenance: formatDateForAPI(formInputs.last_maintenance),
      running_hours: parseInt(formInputs.running_hours)
    };

    console.log("📤 Manual prediction data:", formattedData);
    onPredictClick(formattedData);
  };

  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormInputs({
      ...formInputs,
      [name]: value
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Predict Machine Failure</h2>
        <p>Machine: {selectedMachine?.name} (ID: {selectedMachine?.machine_id})</p>

        <form onSubmit={handleFormSubmit}>
          <input 
            type="hidden" 
            name="machine_id" 
            value={formInputs.machine_id} 
          />

          <div className="form-group">
            <label>Temperature (°C) *</label>
            <input
              type="number"
              name="temperature"
              value={formInputs.temperature}
              onChange={handleInputChange}
              step="0.1"
              required
            />
          </div>

          <div className="form-group">
            <label>Vibration *</label>
            <input
              type="number"
              name="vibration"
              value={formInputs.vibration}
              onChange={handleInputChange}
              step="0.1"
              required
            />
          </div>

          <div className="form-group">
            <label>Pressure (PSI) *</label>
            <input
              type="number"
              name="pressure"
              value={formInputs.pressure}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Oil Level (%) *</label>
            <input
              type="number"
              name="oil_level"
              value={formInputs.oil_level}
              onChange={handleInputChange}
              min="0"
              max="100"
              required
            />
          </div>

          <div className="form-group">
            <label>Error Code *</label>
            <select 
              name="error_code" 
              value={formInputs.error_code} 
              onChange={handleInputChange}
              required
            >
              <option value="NONE">NONE</option>
              <option value="OVERHEAT">OVERHEAT</option>
              <option value="LOW_OIL">LOW_OIL</option>
              <option value="HIGH_VIBRATION">HIGH_VIBRATION</option>
            </select>
          </div>

          <div className="form-group">
            <label>Last Maintenance Date *</label>
            <input
              type="date"
              name="last_maintenance"
              value={formInputs.last_maintenance}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Running Hours *</label>
            <input
              type="number"
              name="running_hours"
              value={formInputs.running_hours}
              onChange={handleInputChange}
              min="0"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn" onClick={onCancelClick}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Make Prediction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PredictionForm;