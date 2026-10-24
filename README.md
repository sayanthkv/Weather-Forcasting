# SkyPulse · MERN Stack Atmospheric Weather Intelligence

SkyPulse is a full-stack **MERN** (MongoDB, Express.js, React, Node.js) weather forecasting platform featuring live atmospheric particle simulations, interactive 24-hour Bézier curve charts, 7-day extended forecasts with Apple-style temperature bars, procedural Web Audio ambiance, and persistent favorites synced with MongoDB.

---

## 🏗️ Architecture Overview

```
Git & GitHub/
├── client/                     # React 19 Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Search autocomplete, unit toggle, audio switch
│   │   │   ├── FavoritesBar.jsx    # Quick-access chips connected to MongoDB
│   │   │   ├── HeroWeather.jsx     # Current conditions, animated SVG art, AI brief
│   │   │   ├── HourlySection.jsx   # 24-hour timeline carousel & tab switcher
│   │   │   ├── WeatherChart.jsx    # Interactive Bézier SVG line chart
│   │   │   ├── DailyForecast.jsx   # 7-day outlook with gradient range bars
│   │   │   ├── WeatherMetrics.jsx  # AQI, UV, Wind compass needle, Solar Arc, etc.
│   │   │   ├── BackgroundCanvas.jsx# Real-time atmospheric particle engine
│   │   │   └── Footer.jsx          # Attribution & sync button
│   │   ├── context/
│   │   │   └── WeatherContext.jsx  # Global React state with MongoDB synchronization
│   │   ├── services/
│   │   │   └── api.js              # Express REST API communication client
│   │   ├── utils/
│   │   │   ├── weatherCodes.js     # WMO codes, UV & AQI scale math
│   │   │   └── ambientAudio.js     # Procedural Web Audio API sound synthesizer
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css               # Glassmorphic CSS design system & animations
│   ├── package.json
│   └── vite.config.js              # Reverse proxy from `/api` to Express port 5000
│
├── server/                     # Node.js + Express.js + MongoDB Backend
│   ├── models/
│   │   ├── Favorite.js         # Mongoose schema for saved locations
│   │   ├── SearchHistory.js    # Mongoose schema for search logs
│   │   └── WeatherCache.js     # Mongoose TTL cache schema (auto-purges after 5m)
│   ├── routes/
│   │   ├── weatherRoutes.js    # `/api/weather`, `/api/weather/search`, `/api/weather/reverse`
│   │   ├── favoriteRoutes.js   # `/api/favorites` (GET, POST, DELETE)
│   │   └── historyRoutes.js    # `/api/history` (GET, POST, DELETE)
│   ├── services/
│   │   └── weatherService.js   # Meteorological fetcher & cache manager
│   ├── server.js               # Express server with resilient MongoDB connection
│   ├── package.json
│   └── .env                    # Environment variables (PORT, MONGODB_URI)
│
├── run-dev.js                  # Unified parallel dev runner for server & client
└── package.json                # Root orchestration scripts
```

---

## ⚡ Quick Start

### 1. Start Both Frontend & Backend (One Command)
```bash
npm run dev
```
- **React Frontend**: [http://localhost:5173/](http://localhost:5173/)
- **Express Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **MongoDB**: Automatically connects to `mongodb://127.0.0.1:27017/skypulse` (with resilient in-memory fallback if MongoDB is ever offline).

### 2. Independent Commands
```bash
# Run only Express Backend
npm run dev:server

# Run only Vite React Frontend
npm run dev:client

# Production client build
npm run build
```

---

## 🌟 Key Features

1. **MongoDB Database Persistence**:
   - Save, star, and manage favorite cities across sessions.
   - Server-side MongoDB TTL caching to reduce API latency and preserve rate limits.
   - Search log tracking for quick suggestions.

2. **Express.js API Layer**:
   - Clean REST endpoints: `/api/weather`, `/api/weather/search`, `/api/weather/reverse`, `/api/favorites`, `/api/history`.
   - Error resilience: Falls back seamlessly if network or database encounters temporary hiccups.

3. **React 19 Frontend**:
   - Modern Context API state management (`WeatherContext`).
   - Interactive Bézier curve SVG chart (`WeatherChart.jsx`) with crosshair hover tooltips.
   - Apple Weather-style 7-day temperature range bars with dynamic color gradients.
   - 8-metric weather matrix: US AQI, UV index gauge, 360° rotating wind compass needle, Solar Arc progression, Humidity, Visibility, Pressure, and Precipitation.
   - Dynamic Canvas atmospheric particle engine (`BackgroundCanvas.jsx`) rendering rain, snow, sunny dust motes, and starry night skies.
   - Procedural Web Audio API sound synthesizer (`ambientAudio.js`) generating gentle rain, breeze, and storm ambiences.
