const axios = require('axios');

const validateRequest = (data) => {
  const requiredFields = [
    "machine_id", "temperature", "vibration", 
    "oil_level", "error_code", "last_maintenance",
    "pressure", "running_hours"
  ];

  const missingFields = requiredFields.filter(field => !(field in data));
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  // Ensure correct formatting
  return {
    machine_id: String(data.machine_id),
    temperature: parseFloat(data.temperature),
    vibration: parseFloat(data.vibration),
    pressure: parseInt(data.pressure),
    oil_level: parseInt(data.oil_level),
    error_code: String(data.error_code),
    last_maintenance: data.last_maintenance, // Format YYYY-MM-DD
    running_hours: parseInt(data.running_hours)
  };
};

const predictFailure = async (data) => {
  try {
    const validData = validateRequest(data);
    const response = await axios.post(process.env.ML_API_URL, validData);
    return response.data;
  } catch (error) {
    console.error('Error calling ML service:', {
      request: data,
      errorDetails: error.response?.data || error.message
    });
    throw new Error(`Error in ML service: ${error.response?.data?.error || error.message}`);
  }
};

module.exports = { predictFailure };