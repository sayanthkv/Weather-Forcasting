import express from 'express';
import SearchHistory from '../models/SearchHistory.js';

const router = express.Router();

let fallbackHistory = [];

router.get('/', async (req, res) => {
  const isDbConnected = req.app.locals.isDbConnected || false;

  if (isDbConnected) {
    try {
      const history = await SearchHistory.find().sort({ createdAt: -1 }).limit(10);
      return res.json(history);
    } catch (err) {
      console.warn('Error reading search history from DB:', err.message);
    }
  }

  res.json(fallbackHistory.slice(0, 10));
});

router.post('/', async (req, res) => {
  const { query, locationName, country, latitude, longitude } = req.body;
  if (!query) return res.status(400).json({ error: 'Query is required' });

  const isDbConnected = req.app.locals.isDbConnected || false;

  if (isDbConnected) {
    try {
      const doc = await SearchHistory.create({ query, locationName, country, latitude, longitude });
      return res.status(201).json(doc);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  const log = { id: Date.now(), query, locationName, country, latitude, longitude, createdAt: new Date() };
  fallbackHistory.unshift(log);
  res.status(201).json(log);
});

router.delete('/', async (req, res) => {
  const isDbConnected = req.app.locals.isDbConnected || false;
  if (isDbConnected) {
    await SearchHistory.deleteMany({});
  }
  fallbackHistory = [];
  res.json({ success: true, message: 'History cleared' });
});

export default router;
