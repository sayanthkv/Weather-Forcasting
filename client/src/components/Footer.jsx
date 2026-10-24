import React, { useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { RefreshCw } from 'lucide-react';

export function Footer() {
  const { currentLocation, loadWeather, weatherData } = useWeather();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    if (!currentLocation) return;
    setIsSyncing(true);
    try {
      await loadWeather(currentLocation, true);
    } finally {
      setTimeout(() => setIsSyncing(false), 500);
    }
  };

  const updatedTime = weatherData?.fetchedAt
    ? new Date(weatherData.fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'Live';

  return (
    <footer className="app-footer" role="contentinfo">
      <div className="footer-left">
        <span>Station Feed Sync: {updatedTime}</span>
        <button
          className={`footer-btn-link ${isSyncing ? 'spinning' : ''}`}
          onClick={handleSync}
          title="Force update observation feed"
        >
          <RefreshCw size={12} />
          <span>Sync</span>
        </button>
      </div>

      <div>
        <span>Isobar · Open-Meteo & BigDataCloud · WMO Numerical Forecast Models</span>
      </div>
    </footer>
  );
}
