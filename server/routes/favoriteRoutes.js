import express from 'express';
import Favorite from '../models/Favorite.js';

const router = express.Router();

// Initial seed cities for quick access
const DEFAULT_CITIES = [
  { name: 'Tokyo', country: 'Japan', countryCode: 'JP', latitude: 35.6895, longitude: 139.6917, timezone: 'Asia/Tokyo' },
  { name: 'London', country: 'United Kingdom', countryCode: 'GB', latitude: 51.5085, longitude: -0.1257, timezone: 'Europe/London' },
  { name: 'New York', country: 'United States', countryCode: 'US', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' },
  { name: 'Paris', country: 'France', countryCode: 'FR', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' },
  { name: 'Sydney', country: 'Australia', countryCode: 'AU', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' }
];

let fallbackFavorites = [...DEFAULT_CITIES.map((c, i) => ({ ...c, _id: String(i + 1) }))];

// GET /api/favorites
router.get('/', async (req, res) => {
  const isDbConnected = req.app.locals.isDbConnected || false;

  if (isDbConnected) {
    try {
      let favorites = await Favorite.find().sort({ createdAt: -1 });
      if (favorites.length === 0) {
        // Auto-seed default cities into MongoDB
        await Favorite.insertMany(DEFAULT_CITIES);
        favorites = await Favorite.find().sort({ createdAt: -1 });
      }
      return res.json(favorites);
    } catch (err) {
      console.warn('Error fetching favorites from DB:', err.message);
    }
  }

  res.json(fallbackFavorites);
});

// POST /api/favorites
router.post('/', async (req, res) => {
  try {
    const { name, admin1, country, countryCode, latitude, longitude, timezone, notes } = req.body;

    if (!name || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Name, latitude, and longitude are required.' });
    }

    const isDbConnected = req.app.locals.isDbConnected || false;

    if (isDbConnected) {
      const existing = await Favorite.findOne({
        $or: [
          { latitude: Number(latitude), longitude: Number(longitude) },
          { name: name.trim(), country: country ? country.trim() : '' }
        ]
      });

      if (existing) {
        return res.status(200).json(existing);
      }

      const fav = await Favorite.create({
        name: name.trim(),
        admin1: admin1 || '',
        country: country || '',
        countryCode: countryCode || '',
        latitude: Number(latitude),
        longitude: Number(longitude),
        timezone: timezone || 'auto',
        notes: notes || ''
      });

      return res.status(201).json(fav);
    } else {
      // In-memory fallback
      const exists = fallbackFavorites.find(f => f.name.toLowerCase() === name.toLowerCase());
      if (exists) return res.json(exists);

      const newFav = {
        _id: Date.now().toString(),
        name,
        admin1: admin1 || '',
        country: country || '',
        countryCode: countryCode || '',
        latitude: Number(latitude),
        longitude: Number(longitude),
        timezone: timezone || 'auto',
        notes: notes || ''
      };
      fallbackFavorites.push(newFav);
      return res.status(201).json(newFav);
    }
  } catch (err) {
    console.error('Add favorite error:', err);
    res.status(500).json({ error: err.message || 'Failed to save favorite' });
  }
});

// DELETE /api/favorites/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const isDbConnected = req.app.locals.isDbConnected || false;

    if (isDbConnected) {
      await Favorite.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Favorite deleted successfully' });
    } else {
      fallbackFavorites = fallbackFavorites.filter(f => f._id !== id && f.name !== id);
      return res.json({ success: true, message: 'Favorite removed from memory store' });
    }
  } catch (err) {
    console.error('Delete favorite error:', err);
    res.status(500).json({ error: err.message || 'Failed to delete favorite' });
  }
});

export default router;
