import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { WeatherChart } from './WeatherChart';
import { getWeatherInfo } from '../utils/weatherCodes';
import { Clock } from 'lucide-react';

export function HourlySection() {
  const { weatherData, convertTemp, hourlyTab, setHourlyTab } = useWeather();
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
    <section className="surface-card hourly-section" aria-label="24-Hour Forecast">
      <div className="section-header">
        <h3 className="section-title">
          <Clock size={16} />
          24-Hour Observations
        </h3>

        <div className="view-tabs" role="tablist">
          <button
            className={`tab-btn ${hourlyTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setHourlyTab('timeline')}
          >
            Strip
          </button>
          <button
            className={`tab-btn ${hourlyTab === 'chart' ? 'active' : ''}`}
            onClick={() => setHourlyTab('chart')}
          >
            Curve
          </button>
        </div>
      </div>

      {hourlyTab === 'timeline' ? (
        <div className="hourly-timeline-slider">
          {items.map((item, idx) => (
            <div key={idx} className={`hourly-card ${item.isCurrent ? 'is-current' : ''}`}>
              <span className="hourly-time">{item.label}</span>
              <div className="hourly-icon">
                <CleanMiniIcon type={item.iconType} />
              </div>
              <span className="hourly-temp">{item.temp}°</span>
              {item.pop > 10 ? (
                <div className="hourly-pop">{item.pop}%</div>
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

export function CleanMiniIcon({ type }) {
  switch (type) {
    case 'sun':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
        </svg>
      );
    case 'moon':
    case 'moon-star':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      );
    case 'cloud':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
        </svg>
      );
    case 'cloud-sun':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
        </svg>
      );
    case 'cloud-rain':
    case 'cloud-drizzle':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round">
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/>
        </svg>
      );
    case 'cloud-rain-wind':
    case 'cloud-lightning':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round">
          <path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/><path d="m13 10-3 5h4l-3 5"/>
        </svg>
      );
    case 'snowflake':
    case 'cloud-snow':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round">
          <path d="M2 12h20"/><path d="M12 2v20"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/>
        </svg>
      );
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4"/>
        </svg>
      );
  }
}
