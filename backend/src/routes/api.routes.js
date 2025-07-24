const express = require('express');
const router = express.Router();
const machineController = require('../controllers/machine.controller');
const predictController = require('../controllers/predict.controller');

// Machine CRUD
router.post('/machines', machineController.create);
router.get('/machines', machineController.getAll);
router.get('/machines/:machineId', machineController.getById);
router.put('/machines/:machineId', machineController.update);
router.delete('/machines/:machineId', machineController.delete);

// Prediction endpoint
router.post('/predict', predictController.predict);

module.exports = router;