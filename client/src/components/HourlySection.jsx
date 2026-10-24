import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { WeatherChart } from './WeatherChart';
import { getWeatherInfo } from '../utils/weatherCodes';
import { Clock } from 'lucide-react';

export function HourlySection() {
  const { weatherData, unit, convertTemp, hourlyTab, setHourlyTab } = useWeather();
  const hourly = weatherData?.hourly;

  if (!hourly || !hourly.time) return null;

  const now = new Date();
  let startIndex = 0;
  for (let i = 0; i < hourly.time.length; i++) {
    if (new Date(hourly.time[i]) >= now) {
      startIndex = Math.max(0, i - 1);
      break;
    }
  }

  const items = [];
  const count = Math.min(24, hourly.time.length - startIndex);

  for (let i = 0; i < count; i++) {
    const idx = startIndex + i;
    const rawTemp = hourly.temperature_2m[idx];
    const timeStr = hourly.time[idx];
    const d = new Date(timeStr);
    const label = i === 0 ? 'Now' : d.toLocaleTimeString([], { hour: 'numeric', hour12: true });
    const code = hourly.weather_code[idx];
    const pop = hourly.precipitation_probability ? hourly.precipitation_probability[idx] : 0;
    const isDay = d.getHours() >= 6 && d.getHours() < 19 ? 1 : 0;
    const info = getWeatherInfo(code, isDay);

    items.push({
      label,
      temp: convertTemp(rawTemp),
      pop,
      iconType: info.icon,
      isCurrent: i === 0
    });
  }

  return (
    <section className="glass-card hourly-section" aria-label="24-Hour Forecast">
      <div className="section-header">
        <h3 className="section-title">
          <Clock size={20} />
          24-Hour Forecast
        </h3>

        <div className="view-tabs" role="tablist">
          <button
            className={`tab-btn ${hourlyTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setHourlyTab('timeline')}
          >
            Timeline
          </button>
          <button
            className={`tab-btn ${hourlyTab === 'chart' ? 'active' : ''}`}
            onClick={() => setHourlyTab('chart')}
          >
            Trend Curve
          </button>
        </div>
      </div>

      {hourlyTab === 'timeline' ? (
        <div className="hourly-timeline-slider">
          {items.map((item, idx) => (
            <div key={idx} className={`hourly-card ${item.isCurrent ? 'is-current' : ''}`}>
              <span className="hourly-time">{item.label}</span>
              <div className="hourly-icon">
                <MiniWeatherIcon type={item.iconType} />
              </div>
              <span className="hourly-temp">{item.temp}°</span>
              {item.pop > 10 ? (
                <div className="hourly-pop">
                  <span className="pop-icon">💧</span>
                  <span className="pop-val">{item.pop}%</span>
                </div>
              ) : (
                <div className="hourly-pop-placeholder" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <WeatherChart />
      )}
    </section>
  );
}

export function MiniWeatherIcon({ type }) {
  switch (type) {
    case 'sun':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      );
    case 'moon':
    case 'moon-star':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      );
    case 'cloud':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
        </svg>
      );
    case 'cloud-sun':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6z"/>
        </svg>
      );
    case 'cloud-rain':
    case 'cloud-drizzle':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round">
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/>
        </svg>
      );
    case 'cloud-rain-wind':
    case 'cloud-lightning':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round">
          <path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/><path d="m13 10-3 5h4l-3 5"/>
        </svg>
      );
    case 'snowflake':
    case 'cloud-snow':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="#e0f2fe" strokeWidth="2" strokeLinecap="round">
          <path d="M2 12h20"/><path d="M12 2v20"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2v2"/><circle cx="12" cy="12" r="5"/>
        </svg>
      );
  }
}
