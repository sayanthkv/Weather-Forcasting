import React, { useState, useEffect, useRef } from 'react';
import { useWeather } from '../context/WeatherContext';
import { searchLocations } from '../services/api';
import { getCountryFlag } from '../utils/weatherCodes';
import { Search, X, Crosshair, Volume2, VolumeX, Compass } from 'lucide-react';

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
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchWrapperRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const data = await searchLocations(query);
        setResults(data);
        setShowDropdown(true);
        setSelectedIndex(-1);
      } catch (err) {
        console.error('Search error:', err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Global keydown for ⌘K or / to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to dismiss dropdown
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

  const handleInputKeyDown = (e) => {
    if (!showDropdown || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
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
        <div className="brand-mark" aria-hidden="true">
          <Compass size={18} strokeWidth={2.2} />
        </div>
        <div className="brand-meta">
          <div className="brand-title-row">
            <span className="brand-title">Isobar</span>
            <span className="live-indicator">
              <span className="live-dot" /> LIVE
            </span>
          </div>
          <span className="brand-subtitle">Atmospheric Observation System</span>
        </div>
      </div>

      <div className="search-container" ref={searchWrapperRef}>
        <div className="search-wrapper">
          <span className="search-icon-left" aria-hidden="true">
            <Search size={15} />
          </span>

          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search stations, cities, or coordinates..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
            onKeyDown={handleInputKeyDown}
            autoComplete="off"
            spellCheck="false"
          />

          <div className="search-actions">
            {query.length > 0 ? (
              <button
                className="icon-btn-ghost"
                onClick={() => { setQuery(''); setShowDropdown(false); inputRef.current?.focus(); }}
                title="Clear query"
              >
                <X size={14} />
              </button>
            ) : (
              <span className="search-kbd" title="Shortcut">⌘K</span>
            )}

            <button
              className="icon-btn-ghost"
              onClick={detectCurrentLocation}
              title="Locate nearest station"
            >
              <Crosshair size={15} />
            </button>
          </div>

          {showDropdown && (
            <div className="search-dropdown" role="listbox">
              {results.length > 0 ? (
                results.map((loc, idx) => (
                  <div
                    key={loc.id || `${loc.name}-${idx}`}
                    className={`search-item ${selectedIndex === idx ? 'selected' : ''}`}
                    onClick={() => handleSelect(loc)}
                  >
                    <div className="search-item-info">
                      <span className="search-flag">{getCountryFlag(loc.countryCode)}</span>
                      <div>
                        <div className="search-name">{loc.name}</div>
                        <div className="search-sub">{[loc.admin1, loc.country].filter(Boolean).join(', ')}</div>
                      </div>
                    </div>
                    <span className="search-coords">
                      {Math.abs(loc.latitude).toFixed(2)}°{loc.latitude >= 0 ? 'N' : 'S'}, {Math.abs(loc.longitude).toFixed(2)}°{loc.longitude >= 0 ? 'E' : 'W'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="search-empty">No meteorological stations found for "{query}".</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="header-actions">
        <div className="segmented-control" role="group" aria-label="Units">
          <button
            className={`segmented-btn ${unit === 'C' ? 'active' : ''}`}
            onClick={() => setUnit('C')}
          >
            °C
          </button>
          <button
            className={`segmented-btn ${unit === 'F' ? 'active' : ''}`}
            onClick={() => setUnit('F')}
          >
            °F
          </button>
        </div>

        <button
          className={`control-btn ${audioPlaying ? 'active' : ''}`}
          onClick={toggleAudio}
          title="Toggle atmospheric audio synthesis"
        >
          {audioPlaying ? <Volume2 size={14} /> : <VolumeX size={14} />}
          <span>{audioPlaying ? 'Sound On' : 'Sound Off'}</span>
        </button>
      </div>
    </header>
  );
}
