import mongoose from 'mongoose';

const weatherCacheSchema = new mongoose.Schema({
  cacheKey: {
    type: String,
    required: true,
    unique: true
  },
  data: {
    type: Object,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // MongoDB TTL index: automatically deletes document after 5 minutes
  }
});

export default mongoose.model('WeatherCache', weatherCacheSchema);
