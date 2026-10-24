import React, { useMemo, useState, useRef } from 'react';
import { useWeather } from '../context/WeatherContext';

export function WeatherChart() {
  const { weatherData, unit } = useWeather();
  const hourly = weatherData?.hourly;
  const wrapperRef = useRef(null);

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    time: '',
    temp: 0,
    pop: 0,
    dotX: 0,
    dotY: 0
  });

  const chartData = useMemo(() => {
    if (!hourly || !hourly.time || hourly.time.length === 0) return [];
    const now = new Date();
    let startIndex = 0;
    for (let i = 0; i < hourly.time.length; i++) {
      if (new Date(hourly.time[i]) >= now) {
        startIndex = Math.max(0, i - 1);
        break;
      }
    }

    const sliceCount = 24;
    const hours = [];
    const count = Math.min(sliceCount, hourly.time.length - startIndex);

    for (let i = 0; i < count; i++) {
      const idx = startIndex + i;
      const rawTemp = hourly.temperature_2m[idx];
      const displayTemp = unit === 'F' ? (rawTemp * 9) / 5 + 32 : rawTemp;
      const timeStr = hourly.time[idx];
      const d = new Date(timeStr);
      const timeLabel = i === 0 ? 'Now' : d.toLocaleTimeString([], { hour: 'numeric', hour12: true });

      hours.push({
        timeLabel,
        rawTemp,
        displayTemp,
        pop: hourly.precipitation_probability ? hourly.precipitation_probability[idx] || 0 : 0
      });
    }

    return hours;
  }, [hourly, unit]);

  const svgCalculations = useMemo(() => {
    if (chartData.length < 2) return null;

    const temps = chartData.map(d => d.displayTemp);
    const minT = Math.min(...temps);
    const maxT = Math.max(...temps);
    const padding = Math.max(2, (maxT - minT) * 0.25);
    const scaleMin = minT - padding;
    const scaleMax = maxT + padding;
    const range = scaleMax - scaleMin || 1;

    const svgWidth = 800;
    const svgHeight = 160;
    const topMargin = 20;
    const bottomMargin = 30;
    const usableHeight = svgHeight - topMargin - bottomMargin;

    const points = chartData.map((d, i) => {
      const x = (i / (chartData.length - 1)) * svgWidth;
      const normalized = (d.displayTemp - scaleMin) / range;
      const y = svgHeight - bottomMargin - normalized * usableHeight;
      return { x, y, ...d };
    });

    let pathD = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      pathD += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    const areaD = `${pathD} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;

    return { points, pathD, areaD, topMargin, bottomMargin, svgHeight, svgWidth };
  }, [chartData]);

  const handlePointer = (clientX) => {
    if (!svgCalculations || !wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const relX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const fraction = relX / rect.width;
    const index = Math.round(fraction * (chartData.length - 1));
    const pt = svgCalculations.points[index];

    if (pt) {
      const clampedX = Math.max(45, Math.min(relX, rect.width - 45));
      setTooltip({
        visible: true,
        x: clampedX,
        time: pt.timeLabel,
        temp: Math.round(pt.displayTemp),
        pop: pt.pop,
        dotX: pt.x,
        dotY: pt.y
      });
    }
  };

  if (!svgCalculations) return null;

  const { points, pathD, areaD, topMargin, bottomMargin, svgHeight, svgWidth } = svgCalculations;
  const labelStep = Math.max(1, Math.floor(chartData.length / 6));

  return (
    <div className="weather-chart-container">
      <div
        className="chart-wrapper"
        ref={wrapperRef}
        onMouseMove={(e) => handlePointer(e.clientX)}
        onMouseLeave={() => setTooltip(prev => ({ ...prev, visible: false }))}
        onTouchMove={(e) => handlePointer(e.touches[0].clientX)}
        onTouchEnd={() => setTooltip(prev => ({ ...prev, visible: false }))}
      >
        <svg className="temp-svg" preserveAspectRatio="none" viewBox="0 0 800 160">
          <defs>
            <linearGradient id="isobarChartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Reference grids */}
          <line x1="0" y1={topMargin} x2={svgWidth} y2={topMargin} stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
          <line x1="0" y1={svgHeight - bottomMargin} x2={svgWidth} y2={svgHeight - bottomMargin} stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />

          {/* Fill and Stroke */}
          <path d={areaD} fill="url(#isobarChartGrad)" />
          <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {tooltip.visible && (
            <>
              <line x1={tooltip.dotX} y1="0" x2={tooltip.dotX} y2={svgHeight} stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2" />
              <circle cx={tooltip.dotX} cy={tooltip.dotY} r="4.5" fill="#f1f5f9" stroke="#38bdf8" strokeWidth="2" />
            </>
          )}
        </svg>

        <div className="chart-labels">
          {chartData.map((d, i) => {
            if (i % labelStep !== 0) return null;
            const percent = (i / (chartData.length - 1)) * 100;
            return (
              <div key={i} className="chart-label-node" style={{ left: `${percent}%` }}>
                <span className="label-time">{d.timeLabel}</span>
                <span className="label-temp">{Math.round(d.displayTemp)}°</span>
              </div>
            );
          })}
        </div>

        {tooltip.visible && (
          <div
            className="chart-tooltip"
            style={{
              left: `${tooltip.x}px`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <span className="tip-time">{tooltip.time}</span>
            <span className="tip-temp">{tooltip.temp}°{unit}</span>
            <span className="tip-rain">{tooltip.pop}% precip</span>
          </div>
        )}
      </div>
    </div>
  );
}
