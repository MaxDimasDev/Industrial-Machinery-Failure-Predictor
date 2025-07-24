const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Machine = sequelize.define('Machine', {
  machine_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  temperature: DataTypes.FLOAT,
  vibration: DataTypes.FLOAT,
  pressure: DataTypes.INTEGER,
  oil_level: DataTypes.INTEGER,
  error_code: {
    type: DataTypes.STRING,
    defaultValue: 'NONE'
  },
  last_maintenance: DataTypes.DATE
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Machine;