const Machine = require('../models/Machine');

exports.create = async (req, res) => {
  try {
    const machine = await Machine.create(req.body);
    res.status(201).json(machine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const machines = await Machine.findAll();
    res.json(machines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const machine = await Machine.findByPk(req.params.machineId);
    if (!machine) return res.status(404).json({ error: 'Machine not found' });
    res.json(machine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Machine.update(req.body, {
      where: { machine_id: req.params.machineId }
    });
    if (!updated) return res.status(404).json({ error: 'Machine not found' });
    const updatedMachine = await Machine.findByPk(req.params.machineId);
    res.json(updatedMachine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Machine.destroy({
      where: { machine_id: req.params.machineId }
    });
    if (!deleted) return res.status(404).json({ error: 'Machine not found' });
    res.json({ message: 'Machine deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};