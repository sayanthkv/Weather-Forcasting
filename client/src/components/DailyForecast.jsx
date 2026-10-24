import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { getWeatherInfo } from '../utils/weatherCodes';
import { MiniWeatherIcon } from './HourlySection';
import { Calendar } from 'lucide-react';

export function DailyForecast() {
  const { weatherData, convertTemp } = useWeather();
  const daily = weatherData?.daily;

  if (!daily || !daily.time) return null;

  const weekMin = Math.min(...daily.temperature_2m_min);
  const weekMax = Math.max(...daily.temperature_2m_max);
  const range = weekMax - weekMin || 1;

  return (
    <section className="glass-card daily-forecast-card" aria-label="7-Day Extended Forecast">
      <div className="section-header">
        <h3 className="section-title">
          <Calendar size={20} />
          7-Day Forecast
        </h3>
      </div>

      <div className="daily-forecast-list">
        {daily.time.map((dateStr, i) => {
          const d = new Date(dateStr);
          let dayName = d.toLocaleDateString([], { weekday: 'short' });
          if (i === 0) dayName = 'Today';

          const code = daily.weather_code[i];
          const info = getWeatherInfo(code, 1);
          const minVal = convertTemp(daily.temperature_2m_min[i]);
          const maxVal = convertTemp(daily.temperature_2m_max[i]);
          const pop = daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0;

          const dayMinRaw = daily.temperature_2m_min[i];
          const dayMaxRaw = daily.temperature_2m_max[i];
          const leftPercent = Math.max(0, Math.min(100, ((dayMinRaw - weekMin) / range) * 100));
          const widthPercent = Math.max(10, Math.min(100 - leftPercent, ((dayMaxRaw - dayMinRaw) / range) * 100));

          return (
            <div key={dateStr} className="daily-row">
              <div className="daily-day">
                <span className="day-title">{dayName}</span>
                <span className="day-date">{d.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
              </div>

              <div className="daily-condition">
                <div className="daily-icon">
                  <MiniWeatherIcon type={info.icon} />
                </div>
                <span className="daily-desc">{info.description}</span>
              </div>

              <div className="daily-pop">
                {pop > 15 && <span className="badge-pop">🌧 {pop}%</span>}
              </div>

              <div className="daily-temp-bar-container">
                <span className="temp-min">{minVal}°</span>
                <div className="temp-track">
                  <div
                    className="temp-range-fill"
                    style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                  />
                </div>
                <span className="temp-max">{maxVal}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
