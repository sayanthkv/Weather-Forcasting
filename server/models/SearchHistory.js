import mongoose from 'mongoose';

const searchHistorySchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
    trim: true
  },
  locationName: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  },
  latitude: Number,
  longitude: Number,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 * 7 // Keep search logs for 7 days
  }
});

export default mongoose.model('SearchHistory', searchHistorySchema);
