const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(
  config.mysql.database,
  config.mysql.user,
  config.mysql.password,
  {
    host: config.mysql.host,
    port: config.mysql.port,
    dialect: config.mysql.dialect,
    storage: config.mysql.dialect === 'sqlite' ? config.mysql.storage : null,
    logging: config.nodeEnv === 'development' ? console.log : false,
    pool: config.mysql.dialect !== 'sqlite' ? {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    } : undefined,
    define: {
      timestamps: true,
      underscored: true,
    },
  }
);

const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ MySQL connected: ${config.mysql.host}:${config.mysql.port}/${config.mysql.database}`);

    // Sync models (creates tables if they don't exist)
    const shouldAlter = config.mysql.dialect === 'sqlite' ? false : (config.nodeEnv === 'development');
    await sequelize.sync({ alter: shouldAlter });
    console.log('✅ MySQL/SQLite tables synced');

    return sequelize;
  } catch (error) {
    console.error(`❌ MySQL connection error: ${error.message}`);
    console.warn('⚠️  MySQL features (users, subscriptions, payments) will be unavailable');
    return null;
  }
};

module.exports = { sequelize, connectMySQL };
