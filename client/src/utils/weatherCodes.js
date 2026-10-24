// WMO Weather Interpretation Codes (WW)
// Descriptions, Icons, Categories, and Theme Styles

export const WEATHER_CODES = {
  0: {
    description: 'Clear Sky',
    dayIcon: 'sun',
    nightIcon: 'moon',
    theme: 'clear',
    animation: 'sun',
    summary: 'Expect clear, sunny conditions with uninterrupted visibility.'
  },
  1: {
    description: 'Mainly Clear',
    dayIcon: 'sun-dim',
    nightIcon: 'moon-star',
    theme: 'clear',
    animation: 'sun',
    summary: 'Mostly sunny with occasional sparse clouds.'
  },
  2: {
    description: 'Partly Cloudy',
    dayIcon: 'cloud-sun',
    nightIcon: 'cloud-moon',
    theme: 'partly-cloudy',
    animation: 'clouds',
    summary: 'A pleasant blend of sunshine and passing cloud formations.'
  },
  3: {
    description: 'Overcast',
    dayIcon: 'cloud',
    nightIcon: 'cloud',
    theme: 'cloudy',
    animation: 'clouds',
    summary: 'Cloud cover dominates the sky with overcast conditions.'
  },
  45: {
    description: 'Foggy',
    dayIcon: 'cloud-fog',
    nightIcon: 'cloud-fog',
    theme: 'fog',
    animation: 'mist',
    summary: 'Reduced visibility due to dense ground fog.'
  },
  48: {
    description: 'Rime Fog',
    dayIcon: 'cloud-fog',
    nightIcon: 'cloud-fog',
    theme: 'fog',
    animation: 'mist',
    summary: 'Freezing rime fog creating frosted surfaces and low visibility.'
  },
  51: {
    description: 'Light Drizzle',
    dayIcon: 'cloud-drizzle',
    nightIcon: 'cloud-drizzle',
    theme: 'rain',
    animation: 'rain-light',
    summary: 'Light drizzle expected; keep an umbrella handy.'
  },
  53: {
    description: 'Moderate Drizzle',
    dayIcon: 'cloud-drizzle',
    nightIcon: 'cloud-drizzle',
    theme: 'rain',
    animation: 'rain',
    summary: 'Steady drizzle continuing throughout the area.'
  },
  55: {
    description: 'Dense Drizzle',
    dayIcon: 'cloud-drizzle',
    nightIcon: 'cloud-drizzle',
    theme: 'rain',
    animation: 'rain',
    summary: 'Persistent dense drizzle with wet roadways.'
  },
  56: {
    description: 'Freezing Drizzle',
    dayIcon: 'cloud-snow',
    nightIcon: 'cloud-snow',
    theme: 'snow',
    animation: 'snow',
    summary: 'Freezing drizzle causing slick surfaces. Exercise caution.'
  },
  57: {
    description: 'Heavy Freezing Drizzle',
    dayIcon: 'cloud-snow',
    nightIcon: 'cloud-snow',
    theme: 'snow',
    animation: 'snow',
    summary: 'Heavy freezing drizzle creating hazardous icy patches.'
  },
  61: {
    description: 'Slight Rain',
    dayIcon: 'cloud-rain',
    nightIcon: 'cloud-rain',
    theme: 'rain',
    animation: 'rain-light',
    summary: 'Scattered light showers passing through.'
  },
  63: {
    description: 'Moderate Rain',
    dayIcon: 'cloud-rain',
    nightIcon: 'cloud-rain',
    theme: 'rain',
    animation: 'rain',
    summary: 'Moderate rainfall underway; wet roads and damp conditions.'
  },
  65: {
    description: 'Heavy Rain',
    dayIcon: 'cloud-rain-wind',
    nightIcon: 'cloud-rain-wind',
    theme: 'rain',
    animation: 'rain-heavy',
    summary: 'Heavy rainfall with possible local pooling.'
  },
  66: {
    description: 'Light Freezing Rain',
    dayIcon: 'cloud-snow',
    nightIcon: 'cloud-snow',
    theme: 'snow',
    animation: 'snow',
    summary: 'Light freezing rain leading to icy roads.'
  },
  67: {
    description: 'Heavy Freezing Rain',
    dayIcon: 'cloud-snow',
    nightIcon: 'cloud-snow',
    theme: 'snow',
    animation: 'snow',
    summary: 'Dangerous heavy freezing rain and icy conditions.'
  },
  71: {
    description: 'Slight Snowfall',
    dayIcon: 'snowflake',
    nightIcon: 'snowflake',
    theme: 'snow',
    animation: 'snow',
    summary: 'Gentle flurries and light snowfall dustings.'
  },
  73: {
    description: 'Moderate Snowfall',
    dayIcon: 'snowflake',
    nightIcon: 'snowflake',
    theme: 'snow',
    animation: 'snow',
    summary: 'Steady snowfall accumulating on cold surfaces.'
  },
  75: {
    description: 'Heavy Snowfall',
    dayIcon: 'snowflake',
    nightIcon: 'snowflake',
    theme: 'snow',
    animation: 'snow-heavy',
    summary: 'Intense snowfall with significant accumulation.'
  },
  77: {
    description: 'Snow Grains',
    dayIcon: 'snowflake',
    nightIcon: 'snowflake',
    theme: 'snow',
    animation: 'snow',
    summary: 'Fine icy snow grains falling intermittently.'
  },
  80: {
    description: 'Light Showers',
    dayIcon: 'cloud-rain',
    nightIcon: 'cloud-rain',
    theme: 'rain',
    animation: 'rain-light',
    summary: 'Brief passing light rain showers.'
  },
  81: {
    description: 'Moderate Showers',
    dayIcon: 'cloud-rain',
    nightIcon: 'cloud-rain',
    theme: 'rain',
    animation: 'rain',
    summary: 'Noticeable rain showers intermittently throughout the day.'
  },
  82: {
    description: 'Violent Showers',
    dayIcon: 'cloud-rain-wind',
    nightIcon: 'cloud-rain-wind',
    theme: 'rain',
    animation: 'rain-heavy',
    summary: 'Sudden downpours with gusty winds and heavy rain.'
  },
  85: {
    description: 'Slight Snow Showers',
    dayIcon: 'cloud-snow',
    nightIcon: 'cloud-snow',
    theme: 'snow',
    animation: 'snow',
    summary: 'Occasional light snow showers with brief flurries.'
  },
  86: {
    description: 'Heavy Snow Showers',
    dayIcon: 'cloud-snow',
    nightIcon: 'cloud-snow',
    theme: 'snow',
    animation: 'snow-heavy',
    summary: 'Heavy bursts of snow showers reducing visibility.'
  },
  95: {
    description: 'Thunderstorm',
    dayIcon: 'cloud-lightning',
    nightIcon: 'cloud-lightning',
    theme: 'thunderstorm',
    animation: 'thunderstorm',
    summary: 'Thunderstorm activity detected; lightning and gusty winds.'
  },
  96: {
    description: 'Thunderstorm with Hail',
    dayIcon: 'cloud-lightning',
    nightIcon: 'cloud-lightning',
    theme: 'thunderstorm',
    animation: 'thunderstorm',
    summary: 'Thunderstorm accompanied by small hail and sudden gusts.'
  },
  99: {
    description: 'Severe Thunderstorm & Hail',
    dayIcon: 'cloud-lightning',
    nightIcon: 'cloud-lightning',
    theme: 'thunderstorm',
    animation: 'thunderstorm',
    summary: 'Severe thunderstorm warning: intense lightning and hail.'
  }
};

export function getWeatherInfo(code, isDay = 1) {
  const info = WEATHER_CODES[code] || {
    description: 'Partly Cloudy',
    dayIcon: 'cloud-sun',
    nightIcon: 'cloud-moon',
    theme: 'partly-cloudy',
    animation: 'clouds',
    summary: 'Typical atmospheric conditions for this region.'
  };

  const icon = isDay ? info.dayIcon : info.nightIcon;
  const theme = isDay ? info.theme : (info.theme === 'clear' ? 'night' : `${info.theme}-night`);

  return {
    ...info,
    icon,
    theme,
    isDay: Boolean(isDay)
  };
}

export function getAqiDescription(aqi) {
  if (aqi <= 50) return { label: 'Good', color: '#10b981', advice: 'Air quality is satisfactory and poses little to no risk.' };
  if (aqi <= 100) return { label: 'Moderate', color: '#f59e0b', advice: 'Acceptable; sensitive individuals should consider limiting prolonged outdoor exertion.' };
  if (aqi <= 150) return { label: 'Sensitive', color: '#f97316', advice: 'Members of sensitive groups may experience health effects.' };
  if (aqi <= 200) return { label: 'Unhealthy', color: '#ef4444', advice: 'Everyone may begin to experience adverse health effects.' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: '#8b5cf6', advice: 'Health alert: increased risk for the entire population.' };
  return { label: 'Hazardous', color: '#881337', advice: 'Health warning of emergency conditions. Avoid all outdoor activity.' };
}

export function getUvDescription(uv) {
  if (uv <= 2) return { label: 'Low', color: '#10b981', advice: 'No protection needed. Safe for outdoor activities.' };
  if (uv <= 5) return { label: 'Moderate', color: '#f59e0b', advice: 'Wear sunglasses and apply SPF 30+ sunscreen if outdoors.' };
  if (uv <= 7) return { label: 'High', color: '#f97316', advice: 'Protection required. Seek shade during midday hours.' };
  if (uv <= 10) return { label: 'Very High', color: '#ef4444', advice: 'Extra protection essential. Avoid sun between 11 AM and 4 PM.' };
  return { label: 'Extreme', color: '#8b5cf6', advice: 'Take all precautions. Unprotected skin can burn in minutes.' };
}

export function getWindDirection(deg) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

export function getCountryFlag(code) {
  if (!code || code.length !== 2) return '📍';
  const offset = 127397;
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => c.charCodeAt(0) + offset));
}
