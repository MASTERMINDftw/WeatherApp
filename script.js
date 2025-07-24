const apiKey = "26fd95910e92913e8998e5bf59651004";
let isCelsius = true; // default unit

function getWeatherIcon(weatherMain) {
  const iconMap = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Smoke': '💨',
    'Haze': '🌫️',
    'Dust': '💨',
    'Fog': '🌫️',
    'Sand': '💨',
    'Ash': '🌋',
    'Squall': '🌬️',
    'Tornado': '🌪️'
  };
  return iconMap[weatherMain] || '🌈';
}

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const resultDiv = document.getElementById("weatherResult");

  if (!city) {
    resultDiv.innerHTML = `
      <div class="weather-card">
        <p class="error-message">Please enter a city name.</p>
      </div>
    `;
    return;
  }

  resultDiv.innerHTML = `
    <div class="weather-card">
      <div class="loading">
        <i class="fas fa-spinner fa-spin"></i> Loading weather data...
      </div>
    </div>
  `;

  const unitType = isCelsius ? "metric" : "imperial";
  const unitSymbol = isCelsius ? "°C" : "°F";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unitType}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {
          throw new Error(err.message || "City not found");
        });
      }
      return response.json();
    })
    .then(data => {
      const temp = Math.round(data.main.temp);
      const weather = data.weather[0].description;
      const humidity = data.main.humidity;
      const feelsLike = Math.round(data.main.feels_like);
      const pressure = data.main.pressure;
      const weatherIcon = getWeatherIcon(data.weather[0].main);

      resultDiv.innerHTML = `
        <div class="weather-card">
          <h2 class="city-name">${data.name}, ${data.sys.country}</h2>
          <div class="weather-icon">${weatherIcon}</div>
          <div class="temperature">${temp}${unitSymbol}</div>
          <div class="weather-description">${weather}</div>
          <div class="weather-details">
            <div class="detail-item">
              <div class="detail-value">${feelsLike}${unitSymbol}</div>
              <div class="detail-label">Feels Like</div>
            </div>
            <div class="detail-item">
              <div class="detail-value">${humidity}%</div>
              <div class="detail-label">Humidity</div>
            </div>
            <div class="detail-item">
              <div class="detail-value">${pressure} hPa</div>
              <div class="detail-label">Pressure</div>
            </div>
          </div>
        </div>
      `;
    })
    .catch(error => {
      resultDiv.innerHTML = `
        <div class="weather-card">
          <p class="error-message"><i class="fas fa-exclamation-triangle"></i> ${error.message}</p>
        </div>
      `;
    });
}

// Toggle Celsius / Fahrenheit
function toggleUnit() {
  isCelsius = !isCelsius;
  document.getElementById("unitToggle").innerText = isCelsius ? "Switch to °F" : "Switch to °C";
  getWeather();
}

// Allow Enter key to trigger search
document.getElementById("cityInput").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    getWeather();
  }
});
