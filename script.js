/**
 * =========================================================================
 * WEATHER APP SCRIPT.JS (Open-Meteo Current & 3-Day Forecast Integration)
 * =========================================================================
 * Features:
 * (1) Current weather with emoji, temperature, wind speed, & description
 * (2) 3-Day Daily Forecast with day name, weather emoji, and max/min temperatures
 * (3) Friendly error messages for not found cities or internet failures
 * (4) "Loading..." message shown while fetching data
 * (5) Enter key support in search input
 */

// -------------------------------------------------------------------------
// DOM ELEMENT REFERENCES
// -------------------------------------------------------------------------
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const cityNameEl = document.getElementById('city-name');
const countryNameEl = document.getElementById('country-name');
const temperatureEl = document.getElementById('temperature');
const windSpeedEl = document.getElementById('wind-speed');
const weatherIconEl = document.getElementById('weather-icon');
const weatherDescriptionEl = document.getElementById('weather-description');
const humidityEl = document.getElementById('humidity');
const feelsLikeEl = document.getElementById('feels-like');
const statusMsgEl = document.getElementById('status-message');
const forecastContainer = document.getElementById('forecast-container');
const quickBtns = document.querySelectorAll('.quick-btn');


// -------------------------------------------------------------------------
// (1) WEATHER CODE CONVERTER (Emoji & Description)
// -------------------------------------------------------------------------
/**
 * Translates WMO (World Meteorological Organization) numeric codes
 * into human-friendly emojis and descriptive weather strings.
 */
function getWeatherInfo(code) {
  const weatherMap = {
    // Clear / Sunny
    0: { emoji: '☀️', desc: 'Sunny / Clear' },
    1: { emoji: '🌤️', desc: 'Mainly sunny' },

    // Cloudy
    2: { emoji: '⛅', desc: 'Partly cloudy' },
    3: { emoji: '☁️', desc: 'Overcast / Cloudy' },

    // Fog
    45: { emoji: '🌫️', desc: 'Foggy' },
    48: { emoji: '🌫️', desc: 'Depositing rime fog' },

    // Drizzle
    51: { emoji: '🌦️', desc: 'Light drizzle' },
    53: { emoji: '🌦️', desc: 'Moderate drizzle' },
    55: { emoji: '🌧️', desc: 'Dense drizzle' },

    // Rain
    61: { emoji: '🌧️', desc: 'Slight rain' },
    62: { emoji: '🌧️', desc: 'Moderate rain' },
    65: { emoji: '🌧️', desc: 'Heavy rain' },
    80: { emoji: '🌦️', desc: 'Rain showers' },
    81: { emoji: '🌧️', desc: 'Moderate showers' },
    82: { emoji: '🌧️', desc: 'Violent showers' },

    // Snow
    71: { emoji: '🌨️', desc: 'Light snow' },
    73: { emoji: '❄️', desc: 'Moderate snow' },
    75: { emoji: '❄️', desc: 'Heavy snow' },
    77: { emoji: '❄️', desc: 'Snow grains' },
    85: { emoji: '🌨️', desc: 'Snow showers' },
    86: { emoji: '❄️', desc: 'Heavy snow showers' },

    // Thunderstorm
    95: { emoji: '⛈️', desc: 'Thunderstorm' },
    96: { emoji: '⛈️', desc: 'Thunderstorm with hail' },
    99: { emoji: '⛈️', desc: 'Severe storm with hail' }
  };

  return weatherMap[code] || { emoji: '🌡️', desc: 'Current conditions' };
}


// -------------------------------------------------------------------------
// STATUS & FRIENDLY ERROR MESSAGE HELPER
// -------------------------------------------------------------------------
function displayMessage(message, isError = false) {
  if (!message) {
    statusMsgEl.style.display = 'none';
    statusMsgEl.textContent = '';
    statusMsgEl.className = 'status-message';
    return;
  }

  statusMsgEl.style.display = 'block';
  statusMsgEl.textContent = message;
  statusMsgEl.className = isError ? 'status-message error' : 'status-message info';
}


// -------------------------------------------------------------------------
// 3-DAY FORECAST HELPER: Format Day Name
// -------------------------------------------------------------------------
/**
 * Converts a "YYYY-MM-DD" date string into "Today", "Tomorrow",
 * or the 3-letter weekday name (e.g. "Mon", "Tue").
 */
function formatDayName(dateString, index) {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';

  // Parse date and extract abbreviated weekday (e.g. "Sun", "Wed")
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}


// -------------------------------------------------------------------------
// (2) RENDER 3-DAY FORECAST CARDS
// -------------------------------------------------------------------------
/**
 * Renders the 3 daily forecast cards below the main weather card.
 */
function renderDailyForecast(daily, tempUnit = '°C') {
  if (!forecastContainer || !daily || !daily.time) return;

  // Clear previous forecast cards
  forecastContainer.innerHTML = '';

  // Limit to the first 3 days
  const daysToShow = Math.min(3, daily.time.length);

  for (let i = 0; i < daysToShow; i++) {
    const dateStr = daily.time[i];
    const dayLabel = formatDayName(dateStr, i);
    const code = daily.weather_code[i];
    const maxTemp = Math.round(daily.temperature_2m_max[i]);
    const minTemp = Math.round(daily.temperature_2m_min[i]);
    const weatherInfo = getWeatherInfo(code);

    // Create the daily forecast card element
    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML = `
      <div class="forecast-day">${dayLabel}</div>
      <div class="forecast-icon" aria-label="${weatherInfo.desc}">${weatherInfo.emoji}</div>
      <div class="forecast-desc" title="${weatherInfo.desc}">${weatherInfo.desc}</div>
      <div class="forecast-temps">
        <span class="forecast-max">${maxTemp}${tempUnit}</span>
        <span class="forecast-min">${minTemp}${tempUnit}</span>
      </div>
    `;

    forecastContainer.appendChild(card);
  }
}


// -------------------------------------------------------------------------
// MAIN FUNCTION: FETCH WEATHER & 3-DAY FORECAST DATA
// -------------------------------------------------------------------------
async function getWeatherData(cityName) {
  const query = cityName.trim();

  // Validate input
  if (!query) {
    displayMessage('Please enter a city name to search.', true);
    return;
  }

  // Display "Loading..." state
  displayMessage(`Loading weather for "${query}"...`, false);
  searchBtn.disabled = true;
  searchBtn.textContent = 'Loading...';

  try {
    // ---------------------------------------------------------------------
    // STEP 1: Geocoding via Open-Meteo Geocoding API (Free, no API key)
    // ---------------------------------------------------------------------
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geocodeUrl);

    if (!geoResponse.ok) {
      throw new Error('Geocoding service unavailable');
    }

    const geoData = await geoResponse.json();

    // Friendly error message if city was not found
    if (!geoData.results || geoData.results.length === 0) {
      displayMessage(`Sorry, we couldn't find "${query}". Please check the spelling and try again.`, true);
      return;
    }

    const location = geoData.results[0];
    const { name, latitude, longitude, admin1, country } = location;

    // ---------------------------------------------------------------------
    // STEP 2: Fetch Current Weather AND 3-Day Daily Forecast from Open-Meteo
    // ---------------------------------------------------------------------
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=3&timezone=auto`;
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error('Weather forecast service unavailable');
    }

    const weatherData = await weatherResponse.json();

    // ---------------------------------------------------------------------
    // STEP 3: Update Main Weather Card DOM
    // ---------------------------------------------------------------------
    const current = weatherData.current;
    const units = weatherData.current_units;
    const tempUnit = units.temperature_2m || '°C';
    const weatherInfo = getWeatherInfo(current.weather_code);

    // City and Region labels
    cityNameEl.textContent = name;
    if (countryNameEl) {
      countryNameEl.textContent = [admin1, country].filter(Boolean).join(', ');
    }

    // Temperature, Wind Speed, Emoji, & Condition
    temperatureEl.textContent = `${current.temperature_2m}${tempUnit}`;
    windSpeedEl.textContent = `${current.wind_speed_10m} ${units.wind_speed_10m || 'km/h'}`;
    weatherIconEl.textContent = weatherInfo.emoji;
    weatherDescriptionEl.textContent = weatherInfo.desc;

    // Optional humidity and feels-like
    if (humidityEl && current.relative_humidity_2m !== undefined) {
      humidityEl.textContent = `${current.relative_humidity_2m}%`;
    }
    if (feelsLikeEl && current.apparent_temperature !== undefined) {
      feelsLikeEl.textContent = `${current.apparent_temperature}°C`;
    }

    // ---------------------------------------------------------------------
    // STEP 4: Render 3-Day Forecast Section
    // ---------------------------------------------------------------------
    if (weatherData.daily) {
      renderDailyForecast(weatherData.daily, tempUnit);
    }

    // Clear any previous loading or error message on success
    displayMessage('');

  } catch (error) {
    // Friendly error message for network/offline or server errors
    console.error('Weather App Error:', error);

    if (!navigator.onLine) {
      displayMessage('You seem to be offline. Please check your internet connection.', true);
    } else {
      displayMessage('Unable to fetch weather data right now. Please check your connection and try again.', true);
    }
  } finally {
    // Restore button state
    searchBtn.disabled = false;
    searchBtn.textContent = 'Get Weather';
  }
}


// -------------------------------------------------------------------------
// EVENT LISTENERS: CLICK BUTTON & PRESS ENTER KEY
// -------------------------------------------------------------------------

// Click listener on "Get Weather" button
searchBtn.addEventListener('click', () => {
  getWeatherData(cityInput.value);
});

// Keydown listener for 'Enter' key inside search input
cityInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    getWeatherData(cityInput.value);
  }
});

// Quick suggestion buttons
quickBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const city = btn.getAttribute('data-city');
    cityInput.value = city;
    getWeatherData(city);
  });
});


// -------------------------------------------------------------------------
// INITIAL LOAD: Automatically fetch Chennai weather & 3-day forecast
// -------------------------------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
  getWeatherData('Chennai');
});
