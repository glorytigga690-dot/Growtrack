const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.mysql');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD',
  },
  status: {
    type: DataTypes.ENUM('pending', 'succeeded', 'failed', 'refunded'),
    defaultValue: 'pending',
    allowNull: false,
  },
  transaction_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
  },
  provider: {
    type: DataTypes.ENUM('stripe', 'razorpay', 'sandbox'),
    defaultValue: 'sandbox',
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
}, {
  tableName: 'payments',
  timestamps: true,
  underscored: true,
});

module.exports = Payment;
