import React, { useMemo } from 'react';
import { useWeather } from '../context/WeatherContext';
import { getCountryFlag } from '../utils/weatherCodes';
import { Star } from 'lucide-react';

export function HeroWeather() {
  const {
    currentLocation,
    weatherData,
    unit,
    convertTemp,
    convertWindSpeed,
    convertPressure,
    isCurrentLocationFavorite,
    toggleFavorite,
    themeInfo
  } = useWeather();

  const current = weatherData?.current;
  const daily = weatherData?.daily;

  const localTime = useMemo(() => {
    if (!weatherData?.utcOffsetSeconds && weatherData?.utcOffsetSeconds !== 0) return '--:--';
    const nowUtc = Date.now() + new Date().getTimezoneOffset() * 60000;
    const targetDate = new Date(nowUtc + weatherData.utcOffsetSeconds * 1000);
    const day = targetDate.toLocaleDateString([], { weekday: 'short' });
    const time = targetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const offsetHours = (weatherData.utcOffsetSeconds / 3600);
    const offsetStr = `UTC${offsetHours >= 0 ? '+' : ''}${offsetHours}`;
    return `${day}, ${time} (${offsetStr})`;
  }, [weatherData?.utcOffsetSeconds]);

  if (!current || !daily) {
    return (
      <section className="surface-card hero-card">
        <div className="hero-main">
          <h2 className="hero-city-title">Connecting to meteorological station...</h2>
        </div>
      </section>
    );
  }

  const highVal = convertTemp(daily.temperature_2m_max[0]);
  const minVal = convertTemp(daily.temperature_2m_min[0]);
  const feelsLikeVal = convertTemp(current.apparent_temperature);
  const windStr = convertWindSpeed(current.wind_speed_10m);
  const pressureStr = convertPressure(current.pressure_msl || current.surface_pressure || 1013);
  const precipToday = daily.precipitation_sum ? daily.precipitation_sum[0] : 0;
  const precipStr = unit === 'F' ? `${(precipToday * 0.03937).toFixed(2)} in` : `${precipToday.toFixed(1)} mm`;

  const lat = Math.abs(currentLocation?.latitude || 0).toFixed(2);
  const latDir = (currentLocation?.latitude || 0) >= 0 ? 'N' : 'S';
  const lon = Math.abs(currentLocation?.longitude || 0).toFixed(2);
  const lonDir = (currentLocation?.longitude || 0) >= 0 ? 'E' : 'W';
  const elevation = weatherData.elevation ? `${Math.round(weatherData.elevation)}m ASL` : 'Sea Level';

  return (
    <section className="surface-card hero-card" aria-label="Current Observations">
      <div className="hero-main">
        <div className="hero-header-row">
          <div className="hero-location-block">
            <h2 className="hero-city-title">
              {currentLocation?.name}
              <span className="country-tag">
                {getCountryFlag(currentLocation?.countryCode)} {currentLocation?.country || ''}
              </span>
            </h2>
            <span className="hero-coords-meta">
              {lat}°{latDir}, {lon}°{lonDir} · {elevation} · {localTime}
            </span>
          </div>

          <button
            className={`fav-toggle-btn ${isCurrentLocationFavorite ? 'is-favorited' : ''}`}
            onClick={toggleFavorite}
            title={isCurrentLocationFavorite ? 'Remove bookmark' : 'Bookmark station'}
          >
            <Star size={16} fill={isCurrentLocationFavorite ? '#f59e0b' : 'none'} />
          </button>
        </div>

        <div className="hero-temp-row">
          <div className="hero-temp-number">
            <span>{convertTemp(current.temperature_2m)}</span>
            <span className="hero-temp-unit">°{unit}</span>
          </div>

          <div className="hero-condition-col">
            <div className="hero-condition-pill">
              {themeInfo.description}
            </div>
            <div className="hero-meta-stats">
              <span>Apparent: <strong>{feelsLikeVal}°{unit}</strong></span>
              <span>·</span>
              <span>High: <strong>{highVal}°</strong></span>
              <span>·</span>
              <span>Low: <strong>{minVal}°</strong></span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-instrument-side">
        <div className="hero-glyph-container" aria-hidden="true">
          <CleanWeatherGlyph animation={themeInfo.animation} isDay={themeInfo.isDay} />
        </div>

        <div className="hero-digest-strip">
          <div className="digest-cell">
            <span className="digest-label">Wind</span>
            <span className="digest-val">{windStr}</span>
          </div>
          <div className="digest-cell">
            <span className="digest-label">Barometer</span>
            <span className="digest-val">{pressureStr}</span>
          </div>
          <div className="digest-cell">
            <span className="digest-label">Precip</span>
            <span className="digest-val">{precipStr}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function CleanWeatherGlyph({ animation, isDay }) {
  if (animation.includes('rain') || animation.includes('thunderstorm')) {
    const isThunder = animation.includes('thunderstorm');
    return (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" stroke="#94a3b8" />
        {isThunder ? (
          <path d="m13 10-3 5h4l-3 5" stroke="#f59e0b" fill="#f59e0b" fillOpacity="0.2" />
        ) : (
          <>
            <line x1="8" y1="15" x2="7" y2="19" />
            <line x1="12" y1="15" x2="11" y2="19" />
            <line x1="16" y1="15" x2="15" y2="19" />
          </>
        )}
      </svg>
    );
  }

  if (animation.includes('snow')) {
    return (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#bae6fd" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h20" />
        <path d="M12 2v20" />
        <path d="m20 16-4-4 4-4" />
        <path d="m4 8 4 4-4 4" />
        <path d="m16 4-4 4-4-4" />
        <path d="m8 20 4-4 4 4" />
      </svg>
    );
  }

  if (!isDay) {
    return (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        <circle cx="12" cy="7" r="1" fill="#cbd5e1" />
      </svg>
    );
  }

  if (animation === 'clouds') {
    return (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      </svg>
    );
  }

  // Clear / Sun
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
      <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
      <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
    </svg>
  );
}
