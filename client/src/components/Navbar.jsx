import React, { useState, useEffect, useRef } from 'react';
import { useWeather } from '../context/WeatherContext';
import { searchLocations } from '../services/api';
import { getCountryFlag } from '../utils/weatherCodes';
import { Cloud, Search, X, Crosshair, Volume2, VolumeX } from 'lucide-react';

export function Navbar() {
  const {
    unit,
    setUnit,
    loadWeather,
    audioPlaying,
    toggleAudio,
    detectCurrentLocation
  } = useWeather();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchWrapperRef = useRef(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchLocations(query);
        setResults(data);
        setShowDropdown(true);
        setSelectedIndex(-1);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleSelect = (loc) => {
    setQuery(loc.name);
    setShowDropdown(false);
    loadWeather(loc);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  return (
    <header className="app-header" role="banner">
      <div className="brand-section">
        <div className="brand-logo-icon">
          <Cloud size={24} color="#38bdf8" />
        </div>
        <div>
          <h1 className="brand-title">SkyPulse</h1>
          <p className="brand-subtitle">Atmospheric Intelligence · MERN</p>
        </div>
      </div>

      <div className="search-container" ref={searchWrapperRef}>
        <div className="search-wrapper">
          <span className="search-icon-left">
            <Search size={18} />
          </span>

          <input
            type="text"
            className="search-input"
            placeholder="Search any global city, state, or country..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
            onKeyDown={handleKeyDown}
          />

          <div className="search-actions">
            {query.length > 0 && (
              <button
                className="icon-btn-subtle"
                onClick={() => { setQuery(''); setShowDropdown(false); }}
                title="Clear input"
              >
                <X size={16} />
              </button>
            )}

            <button
              className="icon-btn-subtle"
              onClick={detectCurrentLocation}
              title="Use current location"
            >
              <Crosshair size={18} />
            </button>
          </div>

          {showDropdown && (
            <div className="search-dropdown">
              {results.length > 0 ? (
                results.map((loc, idx) => (
                  <div
                    key={loc.id || `${loc.name}-${idx}`}
                    className={`search-item ${selectedIndex === idx ? 'selected' : ''}`}
                    onClick={() => handleSelect(loc)}
                  >
                    <span className="search-flag">{getCountryFlag(loc.countryCode)}</span>
                    <div className="search-meta">
                      <span className="search-name">{loc.name}</span>
                      <span className="search-sub">{[loc.admin1, loc.country].filter(Boolean).join(', ')}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="search-empty">No locations matching "{query}".</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="header-actions">
        <div className="unit-switch-group">
          <button
            className={`unit-btn ${unit === 'C' ? 'active' : ''}`}
            onClick={() => setUnit('C')}
          >
            °C
          </button>
          <button
            className={`unit-btn ${unit === 'F' ? 'active' : ''}`}
            onClick={() => setUnit('F')}
          >
            °F
          </button>
        </div>

        <button
          className={`action-pill-btn ${audioPlaying ? 'playing' : ''}`}
          onClick={toggleAudio}
          title="Toggle weather ambiance soundscape"
        >
          {audioPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
          <span>{audioPlaying ? 'Mute' : 'Ambiance'}</span>
        </button>
      </div>
    </header>
  );
}
