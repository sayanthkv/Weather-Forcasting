import React from 'react';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { Navbar } from './components/Navbar';
import { FavoritesBar } from './components/FavoritesBar';
import { HeroWeather } from './components/HeroWeather';
import { HourlySection } from './components/HourlySection';
import { DailyForecast } from './components/DailyForecast';
import { WeatherMetrics } from './components/WeatherMetrics';
import { Footer } from './components/Footer';

function WeatherAppContent() {
  const { loading } = useWeather();

  return (
    <>
      <div className="app-mesh-bg" aria-hidden="true" />
      <BackgroundCanvas />

      <div className="app-wrapper">
        <Navbar />
        <FavoritesBar />

        <main role="main">
          <HeroWeather />
          <HourlySection />

          <div className="dashboard-grid">
            <DailyForecast />
            <WeatherMetrics />
          </div>
        </main>

        <Footer />
      </div>

      {loading && (
        <div className="app-loader-overlay">
          <div className="loader-spinner" />
          <span className="loader-text">Fetching Atmospheric Observations...</span>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <WeatherProvider>
      <WeatherAppContent />
    </WeatherProvider>
  );
}
