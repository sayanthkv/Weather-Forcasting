import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { fetchWeather, getFavorites, addFavorite, removeFavorite, reverseGeocode } from '../services/api';
import { getWeatherInfo } from '../utils/weatherCodes';
import { AmbientAudioEngine } from '../utils/ambientAudio';

const WeatherContext = createContext();

const DEFAULT_CITY = {
  name: 'London',
  country: 'United Kingdom',
  countryCode: 'GB',
  latitude: 51.5085,
  longitude: -0.1257,
  timezone: 'Europe/London'
};

export function WeatherProvider({ children }) {
  const [unit, setUnitState] = useState(() => localStorage.getItem('isobar_unit') || localStorage.getItem('skypulse_unit') || 'C');
  const [currentLocation, setCurrentLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('isobar_last_city') || localStorage.getItem('skypulse_last_city');
      return saved ? JSON.parse(saved) : DEFAULT_CITY;
    } catch (e) {
      return DEFAULT_CITY;
    }
  });

  const [weatherData, setWeatherData] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hourlyTab, setHourlyTab] = useState('timeline');
  const [audioPlaying, setAudioPlaying] = useState(false);

  const audioEngineRef = useRef(null);

  if (!audioEngineRef.current) {
    audioEngineRef.current = new AmbientAudioEngine();
  }

  // Load favorites from Express + MongoDB backend on mount
  useEffect(() => {
    getFavorites()
      .then(favs => setFavorites(favs))
      .catch(err => console.warn('Could not load favorites:', err.message));
  }, []);

  // Fetch weather when location changes
  const loadWeather = async (location, force = false) => {
    if (!location || location.latitude === undefined || location.longitude === undefined) return;
    setLoading(true);
    setError(null);
    setCurrentLocation(location);

    try {
      localStorage.setItem('isobar_last_city', JSON.stringify(location));
      const data = await fetchWeather(location.latitude, location.longitude, location.timezone);
      setWeatherData(data);
    } catch (err) {
      console.error('Weather load error:', err);
      setError(err.message || 'Unable to fetch weather forecast.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(currentLocation);
  }, []);

  const setUnit = (newUnit) => {
    setUnitState(newUnit);
    localStorage.setItem('isobar_unit', newUnit);
  };

  // Convert helpers
  const convertTemp = (celsius) => {
    if (celsius === null || celsius === undefined) return '--';
    if (unit === 'F') return Math.round((celsius * 9) / 5 + 32);
    return Math.round(celsius);
  };

  const convertWindSpeed = (kmh) => {
    if (kmh === null || kmh === undefined) return '--';
    if (unit === 'F') return `${Math.round(kmh * 0.621371)} mph`;
    return `${Math.round(kmh)} km/h`;
  };

  const convertPressure = (hPa) => {
    if (hPa === null || hPa === undefined) return '--';
    if (unit === 'F') return `${(hPa * 0.02953).toFixed(2)} inHg`;
    return `${Math.round(hPa)} hPa`;
  };

  // Compute theme from current weather
  const themeInfo = useMemo(() => {
    if (!weatherData?.current) {
      return { theme: 'clear', animation: 'sun', isDay: true, description: 'Clear' };
    }
    return getWeatherInfo(weatherData.current.weather_code, weatherData.current.is_day);
  }, [weatherData]);

  // Sync body theme classes
  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(`theme-${themeInfo.theme}`);
    if (!themeInfo.isDay) document.body.classList.add('is-night');
  }, [themeInfo]);

  // Favorites toggle with MongoDB backend sync
  const toggleFavorite = async () => {
    if (!currentLocation) return;
    const isFav = favorites.some(
      f => f.name.toLowerCase() === currentLocation.name.toLowerCase() && f.country === currentLocation.country
    );

    try {
      if (isFav) {
        const item = favorites.find(
          f => f.name.toLowerCase() === currentLocation.name.toLowerCase() && f.country === currentLocation.country
        );
        if (item?._id) {
          await removeFavorite(item._id);
        }
        setFavorites(prev => prev.filter(f => f.name.toLowerCase() !== currentLocation.name.toLowerCase()));
      } else {
        const added = await addFavorite(currentLocation);
        setFavorites(prev => [added, ...prev]);
      }
    } catch (err) {
      console.warn('Favorite sync warning:', err.message);
    }
  };

  const isCurrentLocationFavorite = useMemo(() => {
    if (!currentLocation) return false;
    return favorites.some(
      f => f.name.toLowerCase() === currentLocation.name.toLowerCase() && f.country === currentLocation.country
    );
  }, [favorites, currentLocation]);

  // Audio ambiance toggle
  const toggleAudio = () => {
    const isPlaying = audioEngineRef.current.toggle(themeInfo.animation);
    setAudioPlaying(isPlaying);
  };

  // Browser Geolocation
  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const loc = await reverseGeocode(latitude, longitude);
          loadWeather(loc);
        } catch (e) {
          loadWeather({ name: 'My Location', country: '', countryCode: '', latitude, longitude });
        }
      },
      (err) => {
        console.warn('Geolocation failed:', err);
        alert('Could not retrieve your location. Please check browser permissions.');
      },
      { timeout: 10000 }
    );
  };

  return (
    <WeatherContext.Provider
      value={{
        unit,
        setUnit,
        convertTemp,
        convertWindSpeed,
        convertPressure,
        currentLocation,
        weatherData,
        loading,
        error,
        hourlyTab,
        setHourlyTab,
        favorites,
        toggleFavorite,
        isCurrentLocationFavorite,
        loadWeather,
        audioPlaying,
        toggleAudio,
        themeInfo,
        detectCurrentLocation
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
