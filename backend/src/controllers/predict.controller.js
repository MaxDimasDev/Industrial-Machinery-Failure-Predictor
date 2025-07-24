const { predictFailure } = require('../services/ml.service');

exports.predict = async (req, res) => {
  try {
    // Validación básica
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ 
        error: "The request body must be a JSON object",
        example_request: {
          machine_id: "CNC-1",
          temperature: 95.5,
          vibration: 0.8,
          pressure: 210,
          oil_level: 55,
          error_code: "OVERHEAT",
          last_maintenance: "2024-05-01",
          running_hours: 450
        }
      });
    }

    const result = await predictFailure(req.body);
    res.json(result);

  } catch (error) {
    if (error.message.includes('Missing required fields')) {
      return res.status(400).json({
        error: "Incomplete data",
        details: error.message,
        required_fields: [
          "machine_id", "temperature", "vibration",
          "pressure", "oil_level", "error_code",
          "last_maintenance", "running_hours"
        ],
        note: "last_maintenance must follow YYYY-MM-DD format"
      });
    }

    res.status(500).json({ 
      error: "Error processing prediction",
      details: error.message 
    });
  }
};