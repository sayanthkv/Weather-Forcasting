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
      setTimeout(() => setIsSyncing(false), 600);
    }
  };

  const updatedTime = weatherData?.fetchedAt
    ? new Date(weatherData.fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Now';

  return (
    <footer className="app-footer" role="contentinfo">
      <div className="footer-left">
        <span>Live data updated at {updatedTime}</span>
        <button
          className={`footer-btn-link ${isSyncing ? 'spinning' : ''}`}
          onClick={handleSync}
          title="Force refresh meteorological feed"
        >
          <RefreshCw size={14} />
          Sync Now
        </button>
      </div>

      <div>
        <span>Powered by Open-Meteo, Express & MongoDB · MERN Full Stack</span>
      </div>
    </footer>
  );
}
