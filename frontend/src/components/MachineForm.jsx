import { useState, useEffect } from "react"

// Form component for creating and editing machines
function MachineForm({ existingMachine, onSaveClick, onCancelClick }) {
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  // Form state with initial values
  const [formInputs, setFormInputs] = useState({
    machine_id: "",
    name: "",
    temperature: 0,
    vibration: 0,
    pressure: 0,
    oil_level: 0,
    error_code: "NONE",
    last_maintenance: getTodayDate()
  });

  // Load existing machine data if editing
  useEffect(() => {
    if (existingMachine) {
      setFormInputs({
        machine_id: existingMachine.machine_id || "",
        name: existingMachine.name || "",
        temperature: existingMachine.temperature || 0,
        vibration: existingMachine.vibration || 0,
        pressure: existingMachine.pressure || 0,
        oil_level: existingMachine.oil_level || 0,
        error_code: existingMachine.error_code || "NONE",
        last_maintenance: existingMachine.last_maintenance || getTodayDate()
      });
    }
  }, [existingMachine]);

  // Handle form submission
  const handleFormSubmit = (event) => {
    event.preventDefault();
    
    // Validate required fields
    if (!formInputs.machine_id.trim() || !formInputs.name.trim()) {
      alert("Machine ID and Name are required");
      return;
    }

    // Convert numeric fields to appropriate types
    const formattedData = {
      ...formInputs,
      temperature: parseFloat(formInputs.temperature),
      vibration: parseFloat(formInputs.vibration),
      pressure: parseInt(formInputs.pressure),
      oil_level: parseInt(formInputs.oil_level)
    };

    onSaveClick(formattedData);
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
        <h2>{existingMachine ? "Edit Machine" : "Add New Machine"}</h2>

        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label>Machine ID *</label>
            <input
              type="text"
              name="machine_id"
              value={formInputs.machine_id}
              onChange={handleInputChange}
              placeholder="e.g. CNC-001"
              required
              disabled={existingMachine} // Can't change ID when editing
            />
            {existingMachine && <small>Machine ID cannot be modified</small>}
          </div>

          <div className="form-group">
            <label>Machine Name *</label>
            <input
              type="text"
              name="name"
              value={formInputs.name}
              onChange={handleInputChange}
              placeholder="e.g. CNC Machine"
              required
            />
          </div>

          <div className="form-group">
            <label>Temperature (°C)</label>
            <input
              type="number"
              name="temperature"
              value={formInputs.temperature}
              onChange={handleInputChange}
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label>Vibration</label>
            <input
              type="number"
              name="vibration"
              value={formInputs.vibration}
              onChange={handleInputChange}
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label>Pressure (PSI)</label>
            <input
              type="number"
              name="pressure"
              value={formInputs.pressure}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Oil Level (%)</label>
            <input
              type="number"
              name="oil_level"
              value={formInputs.oil_level}
              onChange={handleInputChange}
              min="0"
              max="100"
            />
          </div>

          <div className="form-group">
            <label>Error Code</label>
            <select 
              name="error_code" 
              value={formInputs.error_code} 
              onChange={handleInputChange}
            >
              <option value="NONE">NONE</option>
              <option value="OVERHEAT">OVERHEAT</option>
              <option value="LOW_OIL">LOW_OIL</option>
              <option value="HIGH_VIBRATION">HIGH_VIBRATION</option>
            </select>
          </div>

          <div className="form-group">
            <label>Last Maintenance Date</label>
            <input
              type="date"
              name="last_maintenance"
              value={formInputs.last_maintenance}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn" onClick={onCancelClick}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {existingMachine ? "Update Machine" : "Create Machine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MachineForm;