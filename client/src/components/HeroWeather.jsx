import React, { useMemo } from 'react';
import { useWeather } from '../context/WeatherContext';
import { getCountryFlag } from '../utils/weatherCodes';
import { Bookmark, Info } from 'lucide-react';

export function HeroWeather() {
  const {
    currentLocation,
    weatherData,
    unit,
    convertTemp,
    convertWindSpeed,
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
    const day = targetDate.toLocaleDateString([], { weekday: 'long' });
    const time = targetDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${day}, ${time}`;
  }, [weatherData?.utcOffsetSeconds]);

  if (!current || !daily) {
    return (
      <section className="glass-card hero-weather-card">
        <div className="hero-main">
          <h2 className="hero-city-title">Loading meteorological feed...</h2>
        </div>
      </section>
    );
  }

  const highVal = convertTemp(daily.temperature_2m_max[0]);
  const minVal = convertTemp(daily.temperature_2m_min[0]);
  const feelsLikeVal = convertTemp(current.apparent_temperature);
  const precipChance = daily.precipitation_probability_max ? daily.precipitation_probability_max[0] : 0;
  const windStr = convertWindSpeed(current.wind_speed_10m);

  return (
    <section className="glass-card hero-weather-card" aria-label="Current Weather Overview">
      <div className="hero-main">
        <div className="hero-header-row">
          <div className="hero-location-wrapper">
            <h2 className="hero-city-title">
              {currentLocation?.name}
              <span className="country-tag">
                {getCountryFlag(currentLocation?.countryCode)} {currentLocation?.country || ''}
              </span>
            </h2>

            <button
              className={`fav-toggle-btn ${isCurrentLocationFavorite ? 'is-favorited' : ''}`}
              onClick={toggleFavorite}
              title={isCurrentLocationFavorite ? 'Remove from saved locations' : 'Save location'}
            >
              <Bookmark size={22} fill={isCurrentLocationFavorite ? '#fbbf24' : 'none'} color="#fbbf24" />
            </button>
          </div>

          <div className="hero-time-badge">{localTime}</div>
        </div>

        <div className="hero-temp-row">
          <div className="hero-temp-number">
            <span>{convertTemp(current.temperature_2m)}</span>
            <span className="hero-temp-unit">°{unit}</span>
          </div>

          <div className="hero-condition-details">
            <span className="hero-condition-text">{themeInfo.description}</span>
            <span className="hero-feels-like">Feels like {feelsLikeVal}°{unit}</span>
            <div className="hero-high-low">
              <span>H: {highVal}°</span>
              <span>L: {minVal}°</span>
            </div>
          </div>
        </div>

        <div className="hero-summary-box">
          <span className="hero-summary-icon">
            <Info size={18} />
          </span>
          <p className="hero-summary-text">
            {themeInfo.summary} High today near {highVal}°{unit} with winds around {windStr}
            {precipChance > 20 ? ` and a ${precipChance}% chance of precipitation.` : '.'}
          </p>
        </div>
      </div>

      <div className="hero-visual-side">
        <div className="hero-art-container" aria-hidden="true">
          <WeatherArtSvg animation={themeInfo.animation} isDay={themeInfo.isDay} />
        </div>
      </div>
    </section>
  );
}

function WeatherArtSvg({ animation, isDay }) {
  if (animation.includes('rain') || animation.includes('thunderstorm')) {
    const isThunder = animation.includes('thunderstorm');
    return (
      <svg className="weather-art-svg rain-svg" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <linearGradient id="rainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>
        <g className="cloud-body float-anim">
          <path d="M50 120 A 30 30 0 0 1 75 70 A 45 45 0 0 1 145 75 A 35 35 0 0 1 160 120 Z" fill="url(#cloudGrad)" />
        </g>
        {isThunder ? (
          <polygon className="lightning-strike" points="95,115 80,145 102,145 88,180 125,135 105,135" fill="#facc15" />
        ) : (
          <>
            <line className="raindrop drop-1" x1="70" y1="130" x2="65" y2="155" stroke="url(#rainGrad)" strokeWidth="3" strokeLinecap="round" />
            <line className="raindrop drop-2" x1="100" y1="135" x2="95" y2="160" stroke="url(#rainGrad)" strokeWidth="3" strokeLinecap="round" />
            <line className="raindrop drop-3" x1="130" y1="130" x2="125" y2="155" stroke="url(#rainGrad)" strokeWidth="3" strokeLinecap="round" />
          </>
        )}
      </svg>
    );
  }

  if (animation.includes('snow')) {
    return (
      <svg className="weather-art-svg snow-svg" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="snowCloud" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>
        <g className="cloud-body float-anim">
          <path d="M50 120 A 30 30 0 0 1 75 70 A 45 45 0 0 1 145 75 A 35 35 0 0 1 160 120 Z" fill="url(#snowCloud)" />
        </g>
        <circle className="snowflake flake-1" cx="75" cy="145" r="4" fill="#ffffff" />
        <circle className="snowflake flake-2" cx="105" cy="155" r="5" fill="#ffffff" />
        <circle className="snowflake flake-3" cx="135" cy="145" r="4" fill="#ffffff" />
      </svg>
    );
  }

  if (!isDay) {
    return (
      <svg className="weather-art-svg moon-svg" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="70" fill="url(#moonGlow)" />
        <path className="float-anim" d="M120 40 A 60 60 0 1 0 160 120 A 50 50 0 0 1 120 40 Z" fill="url(#moonGrad)" />
        <circle className="twinkle-star star-1" cx="50" cy="50" r="2.5" fill="#ffffff" />
        <circle className="twinkle-star star-2" cx="155" cy="65" r="2" fill="#ffffff" />
        <circle className="twinkle-star star-3" cx="140" cy="150" r="2" fill="#ffffff" />
      </svg>
    );
  }

  if (animation === 'clouds') {
    return (
      <svg className="weather-art-svg cloud-svg" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="pcloudSun" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="pcloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>
        <circle className="spin-slow" cx="130" cy="70" r="35" fill="url(#pcloudSun)" />
        <g className="float-anim">
          <path d="M40 140 A 35 35 0 0 1 70 85 A 50 50 0 0 1 145 95 A 38 38 0 0 1 165 140 Z" fill="url(#pcloudGrad)" />
        </g>
      </svg>
    );
  }

  // Clear Day Sun
  return (
    <svg className="weather-art-svg sun-svg" viewBox="0 0 200 200">
      <defs>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fde047" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sunCore" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="85" fill="url(#sunGlow)" />
      <g className="sun-rays-rot spin-slow">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1="100"
            y1="28"
            x2="100"
            y2="44"
            stroke="#fbbf24"
            strokeWidth="4.5"
            strokeLinecap="round"
            transform={`rotate(${deg} 100 100)`}
          />
        ))}
      </g>
      <circle className="pulse-sun" cx="100" cy="100" r="44" fill="url(#sunCore)" />
    </svg>
  );
}
