const mongoose = require('mongoose');
const config = require('./config');

const connectMongoDB = async () => {
  // On Vercel, skip MongoDB entirely — use mock model fallback
  if (process.env.VERCEL) {
    console.log('🚀 Vercel detected — skipping MongoDB. Using in-memory mock engine.');
    return null;
  }

  try {
    // Attempt real connection first
    const conn = await mongoose.connect(config.mongo.uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️  MongoDB connection failed: ${error.message}`);
    console.log('🚀 Starting In-Memory MongoDB for development...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      
      const conn = await mongoose.connect(uri);
      console.log('✅ In-Memory MongoDB started successfully!');
      console.log('⚠️  Note: Data will be reset on server restart.');
      return conn;
    } catch (memError) {
      console.error(`❌ Failed to start In-Memory MongoDB: ${memError.message}`);
      return null;
    }
  }
};

module.exports = connectMongoDB;

