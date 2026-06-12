console.log("Starting debug run...");
try {
  console.log("Loading dotenv...");
  require('dotenv').config();
  
  console.log("Loading express...");
  const express = require('express');
  
  console.log("Loading cors...");
  const cors = require('cors');
  
  console.log("Loading config...");
  const config = require('./config/config');
  
  console.log("Loading db.mongo...");
  const connectMongoDB = require('./config/db.mongo');
  
  console.log("Loading db.mysql...");
  const { connectMySQL } = require('./config/db.mysql');

  console.log("Loading routes...");
  const authRoutes = require('./routes/api/auth.routes');
  console.log("All routes loaded!");
  
  console.log("Attempting database connections...");
  (async () => {
    console.log("Connecting Mongo...");
    await connectMongoDB();
    console.log("Mongo connected!");
    
    console.log("Connecting MySQL/SQLite...");
    await connectMySQL();
    console.log("MySQL/SQLite connected!");
    
    console.log("SUCCESS!");
    process.exit(0);
  })();
} catch (e) {
  console.error("CRASHED:", e);
  process.exit(1);
}
