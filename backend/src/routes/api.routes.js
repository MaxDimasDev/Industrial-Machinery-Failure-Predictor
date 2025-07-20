const express = require('express');
const router = express.Router();
const { predictFailure } = require('../services/ml.service');

// Endpoint de predicción
router.post('/predict', async (req, res) => {
  try {
    const prediction = await predictFailure(req.body);
    res.json(prediction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;