import express from 'express';
import { fetchWeatherData, searchLocations, reverseGeocode } from '../services/weatherService.js';
import SearchHistory from '../models/SearchHistory.js';

const router = express.Router();

// GET /api/weather?lat=...&lon=...&timezone=...
router.get('/', async (req, res) => {
  try {
    const { lat, lon, timezone } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude query parameters are required.' });
    }

    const isDbConnected = req.app.locals.isDbConnected || false;
    const weather = await fetchWeatherData(lat, lon, timezone, isDbConnected);
    res.json(weather);
  } catch (err) {
    console.error('Weather route error:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch weather data' });
  }
});

// GET /api/weather/search?q=...
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    const results = await searchLocations(q);

    // Asynchronously log search query to MongoDB if database is connected
    const isDbConnected = req.app.locals.isDbConnected || false;
    if (isDbConnected && results.length > 0) {
      SearchHistory.create({
        query: q.trim(),
        locationName: results[0].name,
        country: results[0].country,
        latitude: results[0].latitude,
        longitude: results[0].longitude
      }).catch(e => console.warn('Search history logging failed:', e.message));
    }

    res.json(results);
  } catch (err) {
    console.error('Search route error:', err);
    res.status(500).json({ error: err.message || 'Search failed' });
  }
});

// GET /api/weather/reverse?lat=...&lon=...
router.get('/reverse', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude parameters are required.' });
    }
    const location = await reverseGeocode(lat, lon);
    res.json(location);
  } catch (err) {
    console.error('Reverse geocode error:', err);
    res.status(500).json({ error: err.message || 'Reverse geocode failed' });
  }
});

export default router;
