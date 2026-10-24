import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { getCountryFlag } from '../utils/weatherCodes';

export function FavoritesBar() {
  const { favorites, currentLocation, loadWeather } = useWeather();

  if (!favorites || favorites.length === 0) return null;

  return (
    <nav className="favorites-bar-wrapper" aria-label="Monitored stations">
      <span className="fav-label">Stations:</span>
      <div className="fav-chips-list">
        {favorites.map((city) => {
          const isSelected =
            currentLocation &&
            currentLocation.name.toLowerCase() === city.name.toLowerCase();

          return (
            <button
              key={city._id || `${city.name}-${city.latitude}`}
              className={`fav-chip ${isSelected ? 'active' : ''}`}
              onClick={() => loadWeather(city)}
            >
              <span>{getCountryFlag(city.countryCode)}</span>
              <span>{city.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
