// Weather Service handling external meteorology APIs & MongoDB Cache
import WeatherCache from '../models/WeatherCache.js';

const FORECAST_BASE = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_BASE = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1/search';
const REVERSE_GEO_BASE = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

// In-memory fallback cache if MongoDB is offline
const memoryCache = new Map();
const MEMORY_CACHE_TTL = 5 * 60 * 1000;

export async function fetchWeatherData(latitude, longitude, timezone = 'auto', isDbConnected = false) {
  const cacheKey = `${Number(latitude).toFixed(3)},${Number(longitude).toFixed(3)}`;

  // 1. Try Cache
  if (isDbConnected) {
    try {
      const cachedDoc = await WeatherCache.findOne({ cacheKey });
      if (cachedDoc) {
        return { ...cachedDoc.data, fromCache: true };
      }
    } catch (err) {
      console.warn('MongoDB cache lookup warning:', err.message);
    }
  } else {
    const mem = memoryCache.get(cacheKey);
    if (mem && Date.now() - mem.timestamp < MEMORY_CACHE_TTL) {
      return { ...mem.data, fromCache: true };
    }
  }

  // 2. Fetch fresh weather & air quality in parallel
  const forecastParams = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m'
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'weather_code',
      'precipitation_probability',
      'precipitation',
      'uv_index',
      'visibility'
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max'
    ].join(','),
    timezone: timezone || 'auto'
  });

  const aqiParams = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'pm10',
      'pm2_5',
      'carbon_monoxide',
      'nitrogen_dioxide',
      'sulphur_dioxide',
      'ozone',
      'european_aqi',
      'us_aqi'
    ].join(','),
    timezone: timezone || 'auto'
  });

  const [forecastRes, aqiRes] = await Promise.allSettled([
    fetch(`${FORECAST_BASE}?${forecastParams.toString()}`).then(r => {
      if (!r.ok) throw new Error(`Forecast service error: HTTP ${r.status}`);
      return r.json();
    }),
    fetch(`${AIR_QUALITY_BASE}?${aqiParams.toString()}`).then(r => {
      if (!r.ok) throw new Error(`AQI service error: HTTP ${r.status}`);
      return r.json();
    })
  ]);

  if (forecastRes.status !== 'fulfilled') {
    throw new Error('Failed to retrieve forecast data.');
  }

  const forecastData = forecastRes.value;
  const aqiData = aqiRes.status === 'fulfilled' ? aqiRes.value : null;

  const result = {
    latitude: forecastData.latitude,
    longitude: forecastData.longitude,
    elevation: forecastData.elevation,
    timezone: forecastData.timezone,
    timezoneAbbreviation: forecastData.timezone_abbreviation,
    utcOffsetSeconds: forecastData.utc_offset_seconds,
    current: forecastData.current,
    hourly: forecastData.hourly,
    daily: forecastData.daily,
    airQuality: aqiData?.current || null,
    fetchedAt: new Date().toISOString(),
    fromCache: false
  };

  // 3. Save to Cache
  if (isDbConnected) {
    WeatherCache.findOneAndUpdate(
      { cacheKey },
      { cacheKey, data: result, createdAt: new Date() },
      { upsert: true, new: true }
    ).catch(e => console.warn('Cache write warning:', e.message));
  } else {
    memoryCache.set(cacheKey, { timestamp: Date.now(), data: result });
  }

  return result;
}

export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];

  const url = `${GEOCODING_BASE}?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding HTTP ${res.status}`);
  const data = await res.json();

  return (data.results || []).map(item => ({
    id: item.id,
    name: item.name,
    admin1: item.admin1 || '',
    country: item.country || '',
    countryCode: item.country_code || '',
    latitude: item.latitude,
    longitude: item.longitude,
    timezone: item.timezone || 'auto'
  }));
}

export async function reverseGeocode(latitude, longitude) {
  const url = `${REVERSE_GEO_BASE}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Reverse Geocode HTTP ${res.status}`);
  const data = await res.json();

  return {
    name: data.city || data.locality || data.principalSubdivision || 'Current Location',
    admin1: data.principalSubdivision || '',
    country: data.countryName || '',
    countryCode: data.countryCode || '',
    latitude: Number(latitude),
    longitude: Number(longitude),
    timezone: 'auto'
  };
}
