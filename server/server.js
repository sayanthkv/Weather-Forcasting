import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import weatherRoutes from './routes/weatherRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import historyRoutes from './routes/historyRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/isobar';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with Graceful Resilience
app.locals.isDbConnected = false;

async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2500
    });
    app.locals.isDbConnected = true;
    console.log(`✅ [MongoDB] Successfully connected to database: ${MONGODB_URI}`);
  } catch (err) {
    app.locals.isDbConnected = false;
    console.warn(`⚠️ [MongoDB] Offline or unreachable (${err.message}).`);
    console.warn(`ℹ️ [Isobar API] Operating with in-memory resilient fallback store.`);
    console.warn(`💡 [Isobar Tip] To connect to MongoDB, start MongoDB locally or specify MONGODB_URI in server/.env.`);
  }
}

connectDatabase();

// API Routes
app.use('/api/weather', weatherRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/history', historyRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Isobar Atmospheric API',
    timestamp: new Date().toISOString(),
    database: app.locals.isDbConnected ? 'connected' : 'in-memory-fallback'
  });
});

const httpServer = app.listen(PORT, () => {
  console.log(`✨ [Isobar API] Server listening on http://localhost:${PORT}`);
});

httpServer.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ [Express API] Port ${PORT} is already in use. Another server instance might be running.`);
    process.exit(1);
  } else {
    console.error('Express server error:', err);
  }
});
