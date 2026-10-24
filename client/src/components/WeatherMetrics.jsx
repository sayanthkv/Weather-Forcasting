import React, { useMemo } from 'react';
import { useWeather } from '../context/WeatherContext';
import { getAqiDescription, getUvDescription, getWindDirection } from '../utils/weatherCodes';
import { Activity, Wind, Sun, Droplets, Eye, Gauge, CloudRain, ShieldAlert } from 'lucide-react';

export function WeatherMetrics() {
  const {
    weatherData,
    unit,
    convertWindSpeed,
    convertPressure
  } = useWeather();

  const current = weatherData?.current;
  const daily = weatherData?.daily;
  const airQuality = weatherData?.airQuality;

  if (!current || !daily) return null;

  // 1. Air Quality
  const aqiVal = airQuality?.us_aqi ? Math.round(airQuality.us_aqi) : 34;
  const aqiInfo = getAqiDescription(aqiVal);
  const aqiPercent = Math.min(100, (aqiVal / 300) * 100);

  // 2. UV Index
  const uvVal = Math.round(daily.uv_index_max ? daily.uv_index_max[0] : 0);
  const uvInfo = getUvDescription(uvVal);
  const uvPercent = Math.min(100, (uvVal / 11) * 100);

  // 3. Wind & Compass
  const windSpeed = current.wind_speed_10m || 0;
  const windGusts = current.wind_gusts_10m || 0;
  const windDir = current.wind_direction_10m || 0;
  const cardinal = getWindDirection(windDir);

  // 4. Solar Cycle
  const solarCycle = useMemo(() => {
    if (!daily.sunrise || !daily.sunset) return null;
    const sunriseDate = new Date(daily.sunrise[0]);
    const sunsetDate = new Date(daily.sunset[0]);
    const now = new Date();
    const totalDaylight = sunsetDate - sunriseDate;
    const elapsed = now - sunriseDate;
    const progress = Math.max(0, Math.min(1, elapsed / totalDaylight));

    const angle = Math.PI * (1 - progress);
    const radius = 55;
    const cx = 80;
    const cy = 70;
    const x = cx + radius * Math.cos(angle);
    const y = cy - radius * Math.sin(angle);

    return {
      sunriseStr: sunriseDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }),
      sunsetStr: sunsetDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }),
      x: x.toFixed(1),
      y: y.toFixed(1)
    };
  }, [daily.sunrise, daily.sunset]);

  // 5. Humidity
  const humidity = current.relative_humidity_2m || 0;
  let humMsg = 'Comfortable moisture level.';
  if (humidity > 70) humMsg = 'High humidity; air feels muggy.';
  else if (humidity < 35) humMsg = 'Dry air; keep hydrated.';

  // 6. Visibility
  const hourlyVis = weatherData?.hourly?.visibility;
  let visKm = 10;
  if (hourlyVis && hourlyVis.length > 0) {
    visKm = Math.round((hourlyVis[0] || 10000) / 1000);
  }
  const visDisplay = unit === 'F' ? `${(visKm * 0.621371).toFixed(1)} mi` : `${visKm} km`;

  // 7. Pressure
  const pressure = current.pressure_msl || current.surface_pressure || 1013;
  let pressTendency = 'Normal atmospheric conditions.';
  if (pressure > 1020) pressTendency = 'High pressure system: stable.';
  else if (pressure < 1005) pressTendency = 'Low pressure system: active weather.';

  // 8. Precipitation & Clouds
  const precipSum = daily.precipitation_sum ? daily.precipitation_sum[0] : 0;
  const precipUnit = unit === 'F' ? `${(precipSum * 0.03937).toFixed(2)} in` : `${precipSum.toFixed(1)} mm`;

  return (
    <section className="metrics-matrix-section" aria-label="Detailed Weather Metrics">
      <div className="section-header">
        <h3 className="section-title">
          <Activity size={20} />
          Weather Matrix & Indicators
        </h3>
      </div>

      <div className="metrics-grid">
        {/* 1. Air Quality */}
        <article className="glass-card metric-card">
          <div className="metric-header">
            <span className="metric-title">
              <ShieldAlert size={16} /> Air Quality
            </span>
            <span className="metric-badge" style={{ color: aqiInfo.color }}>
              {aqiInfo.label}
            </span>
          </div>
          <div className="metric-main-val">{aqiVal}</div>
          <div className="meter-bar-track">
            <div
              className="meter-bar-fill"
              style={{ width: `${aqiPercent}%`, backgroundColor: aqiInfo.color }}
            />
          </div>
          <div className="metric-subvalues">
            <span className="sub-item">
              PM2.5: <strong>{airQuality?.pm2_5 ? `${airQuality.pm2_5.toFixed(1)} µg/m³` : '4.2 µg/m³'}</strong>
            </span>
            <span className="sub-item">
              PM10: <strong>{airQuality?.pm10 ? `${airQuality.pm10.toFixed(1)} µg/m³` : '8.9 µg/m³'}</strong>
            </span>
          </div>
          <p className="metric-footer">{aqiInfo.advice}</p>
        </article>

        {/* 2. UV Index */}
        <article className="glass-card metric-card">
          <div className="metric-header">
            <span className="metric-title">
              <Sun size={16} /> UV Index
            </span>
            <span className="metric-badge" style={{ color: uvInfo.color }}>
              {uvInfo.label}
            </span>
          </div>
          <div className="metric-main-val">{uvVal}</div>
          <div className="meter-bar-track">
            <div
              className="meter-bar-fill"
              style={{ width: `${uvPercent}%`, backgroundColor: uvInfo.color }}
            />
          </div>
          <p className="metric-footer">{uvInfo.advice}</p>
        </article>

        {/* 3. Wind & Compass */}
        <article className="glass-card metric-card">
          <div className="metric-header">
            <span className="metric-title">
              <Wind size={16} /> Wind & Compass
            </span>
            <span className="metric-badge">{cardinal} · {Math.round(windDir)}°</span>
          </div>
          <div className="compass-wrapper">
            <div className="compass-dial">
              <span className="compass-mark n">N</span>
              <span className="compass-mark e">E</span>
              <span className="compass-mark s">S</span>
              <span className="compass-mark w">W</span>
              <div
                className="compass-needle-indicator"
                style={{ transform: `rotate(${windDir}deg)` }}
              />
            </div>
            <div>
              <div className="metric-main-val">{convertWindSpeed(windSpeed)}</div>
              <div className="metric-footer">Gusts: {convertWindSpeed(windGusts)}</div>
            </div>
          </div>
        </article>

        {/* 4. Solar Cycle Arc */}
        <article className="glass-card metric-card">
          <div className="metric-header">
            <span className="metric-title">
              <Sun size={16} /> Solar Cycle
            </span>
          </div>
          {solarCycle && (
            <>
              <div className="solar-arc-wrapper">
                <svg className="solar-svg" viewBox="0 0 160 80">
                  <path
                    d="M 25 70 A 55 55 0 0 1 135 70"
                    fill="none"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="2"
                    strokeDasharray="3"
                  />
                  <circle
                    cx={solarCycle.x}
                    cy={solarCycle.y}
                    r="5"
                    fill="#f59e0b"
                    filter="drop-shadow(0 0 4px #fbbf24)"
                  />
                </svg>
              </div>
              <div className="solar-times-row">
                <span>Dawn: <strong>{solarCycle.sunriseStr}</strong></span>
                <span>Dusk: <strong>{solarCycle.sunsetStr}</strong></span>
              </div>
            </>
          )}
        </article>

        {/* 5. Humidity */}
        <article className="glass-card metric-card">
          <div className="metric-header">
            <span className="metric-title">
              <Droplets size={16} /> Humidity
            </span>
          </div>
          <div className="metric-main-val">{humidity}%</div>
          <p className="metric-footer">{humMsg}</p>
        </article>

        {/* 6. Visibility */}
        <article className="glass-card metric-card">
          <div className="metric-header">
            <span className="metric-title">
              <Eye size={16} /> Visibility
            </span>
          </div>
          <div className="metric-main-val">{visDisplay}</div>
          <p className="metric-footer">
            {visKm >= 10 ? 'Clear horizon and excellent view.' : 'Atmospheric haze present.'}
          </p>
        </article>

        {/* 7. Barometric Pressure */}
        <article className="glass-card metric-card">
          <div className="metric-header">
            <span className="metric-title">
              <Gauge size={16} /> Pressure
            </span>
          </div>
          <div className="metric-main-val">{convertPressure(pressure)}</div>
          <p className="metric-footer">{pressTendency}</p>
        </article>

        {/* 8. Precipitation & Clouds */}
        <article className="glass-card metric-card">
          <div className="metric-header">
            <span className="metric-title">
              <CloudRain size={16} /> Precipitation & Clouds
            </span>
          </div>
          <div className="metric-main-val">{precipUnit}</div>
          <div className="metric-footer">
            Cloud Coverage: <strong>{current.cloud_cover || 0}%</strong>
          </div>
        </article>
      </div>
    </section>
  );
}
