async function getWeatherData(city) {
  const apiKey = 'c9a12ad96912439ef1173090603ce5fa';
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const weatherResponse = await fetch(weatherApiUrl);
    const weatherData = await weatherResponse.json();

    const forecastResponse = await fetch(forecastApiUrl);
    const forecastData = await forecastResponse.json();

    console.log('Weather data:', weatherData); // Log the retrieved data
    console.log('Forecast data:', forecastData); // Log the retrieved forecast data

    return { weatherData, forecastData };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

// Function to display city information
function displayCityInfo(cityInfo) {
  if (!cityInfo || !cityInfo.main) {
    console.error('City information not available');
    return;
  }
  const cityInfoContainer = document.querySelector('.city-info-container');
  cityInfoContainer.innerHTML = `
    <h2>${cityInfo.name}</h2>
    <p>Date: ${new Date().toLocaleDateString()}</p>
    <p>Temperature: ${cityInfo.main.temp} °C</p>
    <p>Wind Speed: ${cityInfo.wind.speed} m/s</p>
    <p>Humidity: ${cityInfo.main.humidity}%</p>
  `;
}

// Function to display 5-day forecast
function displayForecast(forecastData) {
  const forecastContainer = document.querySelector('.forecast');
  forecastContainer.innerHTML = forecastData.list
    .filter((weather, index) => index % 8 === 0) // Take every 8th element (one per day)
    .map(weather => `
      <div class="forecast-item">
        <h3>${new Date(weather.dt * 1000).toLocaleDateString()}</h3>
        <img src="http://openweathermap.org/img/wn/${weather.weather[0].icon}.png" alt="${weather.weather[0].description}">
        <p>Temperature: ${weather.main.temp} °C</p>
        <p>Wind Speed: ${weather.wind.speed} m/s</p>
        <p>Humidity: ${weather.main.humidity}%</p>
      </div>
    `)
    .join('');
}

// Function to handle search
function handleSearch(event) {
  event.preventDefault();
  const city = document.getElementById('city-search').value.trim();
  if (city) {
    getWeatherData(city)
      .then(data => {
        if (data) {
          displayCityInfo(data.weatherData);
          displayForecast(data.forecastData);
          // Save search history
          updateSearchHistory(city);
        }
      });
  }
}

// Function to update search history
function updateSearchHistory(city) {
  const searchHistoryList = document.getElementById('search-history-list');
  const li = document.createElement('li');
  li.textContent = city;
  searchHistoryList.insertBefore(li, searchHistoryList.firstChild);
}

// Event listener for search button
document.getElementById('search-btn').addEventListener('click', handleSearch);




  
  