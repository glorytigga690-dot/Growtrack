require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const config = require('./config/config');
const connectMongoDB = require('./config/db.mongo');
const { connectMySQL } = require('./config/db.mysql');
const { errorHandler } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/api/auth.routes');
const habitRoutes = require('./routes/api/habit.routes');
const goalRoutes = require('./routes/api/goal.routes');
const moodRoutes = require('./routes/api/mood.routes');
const reportRoutes = require('./routes/api/report.routes');
const syncRoutes = require('./routes/api/sync.routes');
const paymentRoutes = require('./routes/api/payment.routes');
const adminRoutes = require('./routes/admin/admin.routes');

const app = express();

// ===== MIDDLEWARE STACK =====

// Security headers
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for PWA flexibility
  crossOriginEmbedderPolicy: false,
}));

// CORS
app.use(cors({
  origin: config.clientUrl === '*' ? true : config.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/', apiLimiter);

// Serve static client files
app.use(express.static(path.join(__dirname, '..', 'client')));

// ===== API ROUTES =====
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/habits', habitRoutes);
app.use('/api/v1/goals', goalRoutes);
app.use('/api/v1/moods', moodRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/sync', syncRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'GrowTrack API is running 🌱',
    version: '1.0.0',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// SPA fallback — serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
  }
});

// ===== ERROR HANDLER =====
app.use(errorHandler);

// ===== START SERVER =====
const startServer = async () => {
  try {
    // Connect databases
    console.log('🔌 Connecting to databases...');
    await connectMongoDB();
    await connectMySQL();

    // Start listening (only if not on Vercel)
    if (!process.env.VERCEL) {
      const PORT = config.port;
      app.listen(PORT, () => {
        console.log('');
        console.log('🌱 ════════════════════════════════════════');
        console.log(`   GrowTrack Server v1.0.0`);
        console.log(`   Environment: ${config.nodeEnv}`);
        console.log(`   Port: ${PORT}`);
        console.log(`   API: http://localhost:${PORT}/api/v1`);
        console.log(`   Client: http://localhost:${PORT}`);
        console.log(`   Payment Mode: ${config.paymentMode}`);
        console.log('🌱 ════════════════════════════════════════');
        console.log('');
      });
    } else {
      console.log('🚀 Server initialized in Vercel Serverless mode.');
    }
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
