require('dotenv').config();

module.exports = {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || (process.env.VERCEL ? '*' : 'http://localhost:5000'),

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'growtrack-jwt-secret-key-12345-abcde',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'growtrack-refresh-secret-key-12345-abcde',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // MongoDB
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/growtrack',
  },

  // MySQL / SQLite
  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'growtrack',
    dialect: process.env.DB_DIALECT || 'sqlite', // Default to sqlite for beginners
    storage: process.env.DB_STORAGE || (process.env.VERCEL ? '/tmp/database.sqlite' : '../database.sqlite'),
  },

  // Stripe
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    prices: {
      pro: process.env.STRIPE_PRICE_PRO,
      team: process.env.STRIPE_PRICE_TEAM,
    },
  },

  // Payment
  paymentMode: process.env.PAYMENT_MODE || 'sandbox',

  // Tier Limits
  tiers: {
    free: {
      maxHabits: 3,
      maxGoals: 1,
      features: ['basic_mood', 'weekly_reports', 'pwa'],
    },
    pro: {
      maxHabits: Infinity,
      maxGoals: Infinity,
      features: ['basic_mood', 'weekly_reports', 'monthly_reports', 'pwa', 'correlation_analytics', 'pdf_export', 'adaptive_scaling', 'priority_sync'],
    },
    team: {
      maxHabits: Infinity,
      maxGoals: Infinity,
      features: ['basic_mood', 'weekly_reports', 'monthly_reports', 'pwa', 'correlation_analytics', 'pdf_export', 'adaptive_scaling', 'priority_sync', 'admin_dashboard', 'cohort_analytics', 'bulk_import', 'custom_reports'],
    },
  },
};
