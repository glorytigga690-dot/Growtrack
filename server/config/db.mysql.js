const config = require('./config');

// ============================================================
// In-memory mock Sequelize for Vercel (sqlite3 native fails)
// ============================================================
const mockStores = {};
let mockIdCounter = 1;

function mockWrap(tableName, raw) {
  const inst = Object.create(raw);
  Object.assign(inst, raw);
  inst.toJSON = () => ({ ...raw });
  inst.update = async (fields) => { Object.assign(raw, fields); return inst; };
  inst.save = async () => inst;
  inst.destroy = async () => {
    const arr = mockStores[tableName] || [];
    const idx = arr.findIndex(r => r.id === raw.id);
    if (idx !== -1) arr.splice(idx, 1);
  };
  return inst;
}

function matchWhere(record, where) {
  return Object.keys(where).every(k => String(record[k]) === String(where[k]));
}

function createMockModel(tableName) {
  if (!mockStores[tableName]) mockStores[tableName] = [];

  const model = {
    findOne: async (opts = {}) => {
      const where = opts.where || {};
      const rec = mockStores[tableName].find(r => matchWhere(r, where));
      return rec ? mockWrap(tableName, rec) : null;
    },
    findByPk: async (id) => {
      const rec = mockStores[tableName].find(r => r.id == id);
      return rec ? mockWrap(tableName, rec) : null;
    },
    findAll: async (opts = {}) => {
      const where = opts.where || {};
      return mockStores[tableName]
        .filter(r => matchWhere(r, where))
        .map(r => mockWrap(tableName, r));
    },
    create: async (data) => {
      const rec = { id: mockIdCounter++, ...data, created_at: new Date(), updated_at: new Date() };
      mockStores[tableName].push(rec);
      return mockWrap(tableName, rec);
    },
    count: async (opts = {}) => {
      const where = opts.where || {};
      return mockStores[tableName].filter(r => matchWhere(r, where)).length;
    },
    destroy: async (opts = {}) => {
      const where = opts.where || {};
      const before = mockStores[tableName].length;
      mockStores[tableName] = mockStores[tableName].filter(r => !matchWhere(r, where));
      return before - mockStores[tableName].length;
    },
    belongsTo: () => {},
    hasMany: () => {},
    hasOne: () => {},
  };
  return model;
}

function createMockSequelize() {
  return {
    define: (name, _schema, opts = {}) => {
      const tableName = opts.tableName || name.toLowerCase() + 's';
      return createMockModel(tableName);
    },
    authenticate: async () => { console.log('✅ Mock SQL database active (in-memory)'); },
    sync: async () => { console.log('✅ Mock SQL tables synced'); },
    query: async (sql, options = {}) => {
      const r = options.replacements || {};
      if (sql.includes('SELECT') && sql.includes('users')) {
        const users = mockStores['users'] || [];
        const found = users.filter(u => u.email === r.username);
        return [found, {}];
      }
      if (sql.includes('INSERT') && sql.includes('users')) {
        if (!mockStores['users']) mockStores['users'] = [];
        const user = {
          id: mockIdCounter++, name: 'glory', email: r.username,
          password_hash: r.password_hash, role: 'client', plan: 'free',
          is_active: true, created_at: new Date(), updated_at: new Date(),
        };
        mockStores['users'].push(user);
        return [user, {}];
      }
      return [[], {}];
    },
  };
}

// ============================================================
// Try real Sequelize, fall back to mock
// ============================================================
let sequelize;
let usingMock = false;

// If we are on Vercel and using SQLite, copy the pre-seeded database.sqlite from the root
// to /tmp/database.sqlite so that the pre-seeded user and initial schema exist.
if (process.env.VERCEL && config.mysql.dialect === 'sqlite') {
  const fs = require('fs');
  const path = require('path');
  const targetPath = config.mysql.storage || '/tmp/database.sqlite';
  
  if (!fs.existsSync(targetPath)) {
    try {
      console.log('🔍 Checking for pre-seeded database.sqlite to copy...');
      const possiblePaths = [
        path.join(process.cwd(), 'database.sqlite'),
        path.join(process.cwd(), 'server', 'database.sqlite'),
        path.join(__dirname, '..', '..', 'database.sqlite'),
        path.join(__dirname, '..', 'database.sqlite'),
      ];
      
      let copied = false;
      for (const src of possiblePaths) {
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, targetPath);
          console.log(`🌱 Copied pre-seeded database from ${src} to ${targetPath}`);
          copied = true;
          break;
        }
      }
      
      if (!copied) {
        console.warn('⚠️ Could not find source database.sqlite. SQLite will start empty.');
      }
    } catch (e) {
      console.warn('⚠️ Failed to copy pre-seeded database.sqlite:', e.message);
    }
  } else {
    console.log('✅ /tmp/database.sqlite already exists, reusing.');
  }
}

try {
  const { Sequelize } = require('sequelize');
  
  // Test if sqlite3 can be loaded to avoid late failures on Vercel
  if (config.mysql.dialect === 'sqlite') {
    require('sqlite3');
  }

  sequelize = new Sequelize(
    config.mysql.database,
    config.mysql.user,
    config.mysql.password,
    {
      host: config.mysql.host,
      port: config.mysql.port,
      dialect: config.mysql.dialect,
      storage: config.mysql.dialect === 'sqlite' ? config.mysql.storage : null,
      logging: false,
      pool: config.mysql.dialect !== 'sqlite' ? {
        max: 10, min: 0, acquire: 30000, idle: 10000,
      } : undefined,
      define: { timestamps: true, underscored: true },
    }
  );
  console.log('✅ Sequelize initialized successfully');
} catch (err) {
  console.warn('⚠️ Sequelize/SQLite init failed:', err.message);
  console.log('🚀 Using in-memory mock database');
  sequelize = createMockSequelize();
  usingMock = true;
}


// ============================================================
// Seed default user
// ============================================================
const seedDefaultUser = async (db) => {
  try {
    const username = 'glorytigga@123';
    const [results] = await db.query(
      'SELECT id FROM users WHERE email = :username LIMIT 1',
      { replacements: { username } }
    );
    if (!results || results.length === 0) {
      console.log('🌱 Seeding default user: glorytigga@123...');
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(12);
      const password_hash = await bcrypt.hash('glorytigga@123', salt);
      await db.query(
        `INSERT INTO users (name, email, password_hash, role, plan, created_at, updated_at)
         VALUES ('glory', :username, :password_hash, 'client', 'free', :now, :now)`,
        { replacements: { username, password_hash, now: new Date() } }
      );
      console.log('✅ Default user seeded!');
    } else {
      console.log('👤 Default user already exists.');
    }
  } catch (error) {
    console.warn('⚠️ Seed skipped:', error.message);
  }
};

// ============================================================
// Connect
// ============================================================
const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    const shouldAlter = (!usingMock && config.mysql.dialect !== 'sqlite' && config.nodeEnv === 'development');
    await sequelize.sync({ alter: shouldAlter });
    await seedDefaultUser(sequelize);
    return sequelize;
  } catch (error) {
    console.error('❌ MySQL connection error:', error.message);
    return null;
  }
};

module.exports = { sequelize, connectMySQL };
