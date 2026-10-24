# Isobar · Precision Atmospheric Observation System

Isobar is an editorial, instrument-grade weather forecasting platform built on the **MERN** stack (MongoDB, Express.js, React 19, Node.js). Designed with Swiss typographic minimalism, high-contrast tabular telemetry, precision Bézier curves, calibrated range bars, and monitored stations.

---

## 🏗️ Architecture Overview

```
Git & GitHub/
├── client/                          # React 19 + Vite Technical Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Command palette search (⌘K), units switcher, sound toggle
│   │   │   ├── FavoritesBar.jsx     # Monitored station strip synced with MongoDB
│   │   │   ├── HeroWeather.jsx      # Tabular temperatures, exact coordinates, telemetry digest
│   │   │   ├── HourlySection.jsx    # 24-hour observation strip & Bézier curve
│   │   │   ├── WeatherChart.jsx     # Precision SVG graph with subtle reference grid
│   │   │   ├── DailyForecast.jsx    # 7-day outlook with continuous calibrated range bars
│   │   │   ├── WeatherMetrics.jsx   # 8-instrument matrix: Barometer, Wind Vector, UV, Moisture, etc.
│   │   │   ├── BackgroundCanvas.jsx # Organic, subtle atmospheric particle physics
│   │   │   └── Footer.jsx           # WMO numerical model specs & sync status
│   │   ├── context/
│   │   │   └── WeatherContext.jsx   # Global React telemetry state & MongoDB persistence
│   │   ├── services/
│   │   │   └── api.js               # Express REST API communication client
│   │   ├── utils/
│   │   │   ├── weatherCodes.js      # WMO code interpretations & telemetry scales
│   │   │   └── ambientAudio.js      # Procedural Web Audio API sound synthesizer
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css                # Precision Swiss-editorial design system
│   ├── package.json
│   └── vite.config.js               # Reverse proxy routing `/api` to Express port 5000
│
├── server/                          # Node.js + Express.js + MongoDB Backend
│   ├── models/
│   │   ├── Favorite.js              # Mongoose schema for monitored stations
│   │   ├── SearchHistory.js         # Mongoose schema for station search logs
│   │   └── WeatherCache.js          # Mongoose TTL cache schema (auto-purges after 5m)
│   ├── routes/
│   │   ├── weatherRoutes.js         # `/api/weather`, `/api/weather/search`, `/api/weather/reverse`
│   │   ├── favoriteRoutes.js        # `/api/favorites` (GET, POST, DELETE)
│   │   └── historyRoutes.js         # `/api/history` (GET, POST, DELETE)
│   ├── services/
│   │   └── weatherService.js        # Meteorological fetcher & MongoDB cache manager
│   ├── server.js                    # Express app with resilient MongoDB connection
│   ├── package.json
│   └── .env                         # Server port (5000) & MONGODB_URI
│
├── run-dev.js                       # Unified parallel runner with automatic port cleaner
└── package.json                     # Root orchestration scripts
```

---

## ⚡ Quick Start

```bash
npm run dev
```

- **Frontend**: [http://localhost:5173/](http://localhost:5173/)
- **API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **MongoDB**: Automatically connects to `mongodb://127.0.0.1:27017/isobar` (with resilient in-memory fallback if MongoDB is ever offline).

---

## 🧭 Design Principles

- **No AI-Generated Clichés**: Stripped away gaudy purple/cyan neon blobs, tacky sparkly badges, and cheesy chatbot text.
- **Precision Swiss-Style Typography**: Tabular monospace numerals (`JetBrains Mono`), high-contrast hierarchy, and razor-sharp borders (`1px solid rgba(255, 255, 255, 0.06)`).
- **Aviation & Marine Grade Telemetry**: Barometric pressure with atmospheric tendency, 360° wind vector compass needle, solar elevation arc, dew point calculations, and continuous calibrated temperature scales.
