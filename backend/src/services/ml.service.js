const axios = require('axios');

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5000/predict';

const predictFailure = async (data) => {
  try {
    const response = await axios.post(ML_API_URL, data);
    return response.data;
  } catch (error) {
    console.error('Error calling ML service:', error.message);
    throw new Error('Failed to get prediction from ML service');
  }
};

module.exports = { predictFailure };