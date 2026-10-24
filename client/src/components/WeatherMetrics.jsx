import React, { useMemo } from 'react';
import { useWeather } from '../context/WeatherContext';
import { getAqiDescription, getUvDescription, getWindDirection } from '../utils/weatherCodes';
import { Sliders, Wind, Sun, Droplets, Eye, Gauge, CloudRain, Shield } from 'lucide-react';

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
  const aqiVal = airQuality?.us_aqi ? Math.round(airQuality.us_aqi) : 32;
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
    const radius = 50;
    const cx = 80;
    const cy = 55;
    const x = cx + radius * Math.cos(angle);
    const y = cy - radius * Math.sin(angle);

    return {
      sunriseStr: sunriseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      sunsetStr: sunsetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      x: x.toFixed(1),
      y: y.toFixed(1)
    };
  }, [daily.sunrise, daily.sunset]);

  // 5. Humidity
  const humidity = current.relative_humidity_2m || 0;
  // Dew point approximation
  const tempC = current.temperature_2m || 0;
  const dewPointC = Math.round(tempC - ((100 - humidity) / 5));
  const dewPointDisplay = unit === 'F' ? `${Math.round((dewPointC * 9) / 5 + 32)}°F` : `${dewPointC}°C`;

  // 6. Visibility
  const hourlyVis = weatherData?.hourly?.visibility;
  let visKm = 10;
  if (hourlyVis && hourlyVis.length > 0) {
    visKm = Math.round((hourlyVis[0] || 10000) / 1000);
  }
  const visDisplay = unit === 'F' ? `${(visKm * 0.621371).toFixed(1)} mi` : `${visKm} km`;

  // 7. Pressure
  const pressure = current.pressure_msl || current.surface_pressure || 1013;
  let pressStatus = 'Standard atmosphere';
  if (pressure > 1022) pressStatus = 'High pressure system · Stable';
  else if (pressure < 1008) pressStatus = 'Low pressure trough · Dynamic';

  // 8. Precipitation & Clouds
  const precipSum = daily.precipitation_sum ? daily.precipitation_sum[0] : 0;
  const precipUnit = unit === 'F' ? `${(precipSum * 0.03937).toFixed(2)} in` : `${precipSum.toFixed(1)} mm`;

  return (
    <section className="metrics-matrix-section" aria-label="Atmospheric Instruments">
      <div className="section-header">
        <h3 className="section-title">
          <Sliders size={16} />
          Atmospheric Telemetry
        </h3>
      </div>

      <div className="metrics-grid">
        {/* 1. Air Quality */}
        <article className="surface-card metric-card">
          <div className="metric-header">
            <span className="metric-title">
              <Shield size={14} /> Air Quality (AQI)
            </span>
            <span className="metric-badge" style={{ color: aqiInfo.color, borderColor: aqiInfo.color }}>
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
            <span>PM2.5: <strong>{airQuality?.pm2_5 ? `${airQuality.pm2_5.toFixed(1)} µg/m³` : '4.0 µg/m³'}</strong></span>
            <span>PM10: <strong>{airQuality?.pm10 ? `${airQuality.pm10.toFixed(1)} µg/m³` : '8.5 µg/m³'}</strong></span>
          </div>
        </article>

        {/* 2. UV Index */}
        <article className="surface-card metric-card">
          <div className="metric-header">
            <span className="metric-title">
              <Sun size={14} /> Solar UV Index
            </span>
            <span className="metric-badge" style={{ color: uvInfo.color, borderColor: uvInfo.color }}>
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

        {/* 3. Wind Vector & Compass */}
        <article className="surface-card metric-card">
          <div className="metric-header">
            <span className="metric-title">
              <Wind size={14} /> Wind Vector
            </span>
            <span className="metric-badge">{cardinal} · {Math.round(windDir)}°</span>
          </div>
          <div className="compass-wrapper">
            <div className="compass-dial" aria-hidden="true">
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
              <div className="metric-footer">Gusts to {convertWindSpeed(windGusts)}</div>
            </div>
          </div>
        </article>

        {/* 4. Solar Trajectory */}
        <article className="surface-card metric-card">
          <div className="metric-header">
            <span className="metric-title">
              <Sun size={14} /> Solar Window
            </span>
          </div>
          {solarCycle && (
            <>
              <div className="solar-arc-wrapper">
                <svg className="solar-svg" viewBox="0 0 160 65">
                  <path
                    d="M 30 55 A 50 50 0 0 1 130 55"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1.5"
                    strokeDasharray="2"
                  />
                  <circle
                    cx={solarCycle.x}
                    cy={solarCycle.y}
                    r="4"
                    fill="#f59e0b"
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

        {/* 5. Humidity & Dew Point */}
        <article className="surface-card metric-card">
          <div className="metric-header">
            <span className="metric-title">
              <Droplets size={14} /> Moisture & Dew
            </span>
            <span className="metric-badge">Dew: {dewPointDisplay}</span>
          </div>
          <div className="metric-main-val">{humidity}%</div>
          <p className="metric-footer">Calculated dew point of {dewPointDisplay}</p>
        </article>

        {/* 6. Optical Visibility */}
        <article className="surface-card metric-card">
          <div className="metric-header">
            <span className="metric-title">
              <Eye size={14} /> Optical Visibility
            </span>
          </div>
          <div className="metric-main-val">{visDisplay}</div>
          <p className="metric-footer">
            {visKm >= 10 ? 'Unobstructed horizon clarity.' : 'Atmospheric particulates present.'}
          </p>
        </article>

        {/* 7. Barometric Pressure */}
        <article className="surface-card metric-card">
          <div className="metric-header">
            <span className="metric-title">
              <Gauge size={14} /> Barometric Pressure
            </span>
          </div>
          <div className="metric-main-val">{convertPressure(pressure)}</div>
          <p className="metric-footer">{pressStatus}</p>
        </article>

        {/* 8. Precipitation & Cloud Cover */}
        <article className="surface-card metric-card">
          <div className="metric-header">
            <span className="metric-title">
              <CloudRain size={14} /> 24h Liquid Accumulation
            </span>
          </div>
          <div className="metric-main-val">{precipUnit}</div>
          <div className="metric-footer">
            Cloud Cover Fraction: <strong>{current.cloud_cover || 0}%</strong>
          </div>
        </article>
      </div>
    </section>
  );
}
