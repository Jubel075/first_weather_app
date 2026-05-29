const weatherForm = document.querySelector('.weather-form');
const cityInput = document.querySelector('.cityInput');
const card = document.querySelector('.card');

const API_KEY = 'c208fd64e97e171f7ab5ad762037af30';

weatherForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    try {
      const weatherData = await fetchWeatherData(city);
      displayWeatherData(weatherData);
      console.log('Weather data:', weatherData);
    } catch (error) {
      displayError(error.message);
    }
  } else {
    displayError('Please enter a city name.');
  }
});

async function fetchWeatherData(city) {
  const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=3&appid=${API_KEY}`;
  const geoResponse = await fetch(geoURL);
  const geoData = await geoResponse.json();

  if (geoData.length === 0) {
    throw new Error(`City "${city}" not found.`);
  }

  const { lat, lon } = geoData[0];
  console.log(`Coordinates for ${city}: lat=${lat}, lon=${lon}`);

  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const weatherResponse = await fetch(weatherURL);

  if (!weatherResponse.ok) {
    throw new Error(`Weather API error: ${weatherResponse.statusText}`);
  }

  return await weatherResponse.json();
}

function displayWeatherData(data) {
  const {
    name: city,
    main: { temp, humidity },
    weather: [{ description, id }],
  } = data;

  card.textContent = '';
  card.style.display = 'flex';

  const cityDisplay = document.createElement('h1');
  const temperatureDisplay = document.createElement('p');
  const humidityDisplay = document.createElement('p');
  const descriptionDisplay = document.createElement('p');
  const weatherIcon = document.createElement('p');

  cityDisplay.textContent = city;
  cityDisplay.classList.add('cityDisplay');
  card.appendChild(cityDisplay);

  temperatureDisplay.textContent = `Temperature: ${temp}°C`;
  card.appendChild(temperatureDisplay);

  humidityDisplay.textContent = `Humidity: ${humidity}%`;
  card.appendChild(humidityDisplay);

  descriptionDisplay.textContent = `Conditions: ${description}`;
  card.appendChild(descriptionDisplay);

  weatherIcon.textContent = getWeatherIcon(id);
  card.appendChild(weatherIcon);
}

function getWeatherIcon(weatherID) {
  switch (true) {
    case weatherID >= 200 && weatherID < 300:
      return '⛈️'; // Thunderstorm
    case weatherID >= 300 && weatherID < 400:
      return '🌧️'; // Drizzle
    case weatherID >= 500 && weatherID < 600:
      return '🌧️';
    case weatherID >= 600 && weatherID < 700:
      return '❄️'; // Snow
    case weatherID >= 700 && weatherID < 800:
      return '🌫️'; // Atmosphere (fog, mist, etc.)
    case weatherID === 800:
      return '☀️'; // Clear
    case weatherID > 800 && weatherID < 900:
      return '☁️'; // Clouds
    default:
      return '❓'; // Unknown
  }
}

function displayError(message) {
  const errorDisplay = document.createElement('p');
  errorDisplay.textContent = message;
  errorDisplay.classList.add('errorDisplay');

  card.textContent = '';
  card.style.display = 'flex';
  card.appendChild(errorDisplay);
}
