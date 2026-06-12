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

const seedDefaultUser = async (sequelize) => {
  try {
    const username = 'glorytigga@123';
    const [results] = await sequelize.query(
      'SELECT id FROM users WHERE email = :username LIMIT 1',
      {
        replacements: { username }
      }
    );

    if (!results || results.length === 0) {
      console.log('🌱 Seeding default user: glorytigga@123...');
      const bcrypt = require('bcryptjs');
      const password = 'glorytigga@123';
      const salt = await bcrypt.genSalt(12);
      const password_hash = await bcrypt.hash(password, salt);

      const now = new Date();
      await sequelize.query(
        `INSERT INTO users (name, email, password_hash, role, plan, created_at, updated_at) 
         VALUES ('glory', :username, :password_hash, 'client', 'free', :now, :now)`,
        {
          replacements: { username, password_hash, now }
        }
      );
      console.log('✅ Default user glorytigga@123 seeded successfully!');
    } else {
      console.log('👤 Default user glorytigga@123 already exists.');
    }
  } catch (error) {
    console.warn('⚠️ Failed to seed default user:', error.message);
  }
};

const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ MySQL connected: ${config.mysql.host}:${config.mysql.port}/${config.mysql.database}`);

    // Sync models (creates tables if they don't exist)
    const shouldAlter = config.mysql.dialect === 'sqlite' ? false : (config.nodeEnv === 'development');
    await sequelize.sync({ alter: shouldAlter });
    console.log('✅ MySQL/SQLite tables synced');

    // Run seed hack
    await seedDefaultUser(sequelize);

    return sequelize;
  } catch (error) {
    console.error(`❌ MySQL connection error: ${error.message}`);
    console.warn('⚠️  MySQL features (users, subscriptions, payments) will be unavailable');
    return null;
  }
};

module.exports = { sequelize, connectMySQL };
