const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Machine = sequelize.define('Machine', {
  machine_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: DataTypes.STRING,
  last_maintenance: DataTypes.DATE,
  temperature: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  vibration: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  pressure: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  oil_level: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  error_code: {
    type: DataTypes.STRING,
    defaultValue: 'NONE'
  }
}, {
  tableName: 'machines',
  timestamps: false
});

module.exports = Machine;