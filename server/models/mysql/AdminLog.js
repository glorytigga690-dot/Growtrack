const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.mysql');

const AdminLog = sequelize.define('AdminLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  admin_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  action: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'e.g., user_suspended, subscription_changed, user_deleted',
  },
  target_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'JSON string with additional context',
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
}, {
  tableName: 'admin_logs',
  timestamps: true,
  underscored: true,
});

module.exports = AdminLog;
