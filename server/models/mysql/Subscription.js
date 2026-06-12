const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.mysql');

const Subscription = sequelize.define('Subscription', {
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
  plan_type: {
    type: DataTypes.ENUM('free', 'pro', 'team'),
    defaultValue: 'free',
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'cancelled', 'expired', 'past_due', 'trialing'),
    defaultValue: 'active',
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  provider_ref: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Stripe subscription ID or Razorpay subscription ID',
  },
  cancel_at_period_end: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'subscriptions',
  timestamps: true,
  underscored: true,
});

module.exports = Subscription;
