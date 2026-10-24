import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  admin1: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  },
  countryCode: {
    type: String,
    default: ''
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  timezone: {
    type: String,
    default: 'auto'
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Avoid duplicate coordinates for favorites
favoriteSchema.index({ latitude: 1, longitude: 1 }, { unique: true });

export default mongoose.model('Favorite', favoriteSchema);
