// Frontend API client communicating with Express + MongoDB Backend

const API_BASE = '/api';

export async function fetchWeather(lat, lon, timezone = 'auto') {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    timezone: timezone || 'auto'
  });

  const res = await fetch(`${API_BASE}/weather?${params.toString()}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Weather API HTTP ${res.status}`);
  }
  return res.json();
}

export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];

  const res = await fetch(`${API_BASE}/weather/search?q=${encodeURIComponent(query.trim())}`);
  if (!res.ok) throw new Error(`Search API HTTP ${res.status}`);
  return res.json();
}

export async function reverseGeocode(lat, lon) {
  const res = await fetch(`${API_BASE}/weather/reverse?lat=${lat}&lon=${lon}`);
  if (!res.ok) throw new Error(`Reverse Geocode API HTTP ${res.status}`);
  return res.json();
}

export async function getFavorites() {
  const res = await fetch(`${API_BASE}/favorites`);
  if (!res.ok) throw new Error(`Favorites API HTTP ${res.status}`);
  return res.json();
}

export async function addFavorite(location) {
  const res = await fetch(`${API_BASE}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(location)
  });
  if (!res.ok) throw new Error(`Add Favorite API HTTP ${res.status}`);
  return res.json();
}

export async function removeFavorite(id) {
  const res = await fetch(`${API_BASE}/favorites/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`Remove Favorite API HTTP ${res.status}`);
  return res.json();
}
