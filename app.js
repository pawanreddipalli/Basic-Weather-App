// Author: Pawan Reddipalli

const apiKey = '32a3972b56c5348e4041b68af3289e43'; // Replace with your OpenWeather API key
const weatherElement = document.getElementById('weather');
const forecastElement = document.getElementById('forecast');
const historyElement = document.getElementById('history');
const cityInput = document.getElementById('cityInput');
const unitSelect = document.getElementById('unitSelect');

// Fetch weather data
function fetchWeather(city, unit) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

    weatherElement.innerHTML = '<p>Loading...</p>'; // Show loading indicator

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const weatherData = `
                    <h2>${data.name}, ${data.sys.country}</h2>
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
                    <p>Temperature: ${data.main.temp}°${unit === 'metric' ? 'C' : 'F'}</p>
                    <p>Weather: ${data.weather[0].description}</p>
                    <p>Humidity: ${data.main.humidity}%</p>
                    <p>Wind Speed: ${data.wind.speed} m/s</p>
                `;
                weatherElement.innerHTML = weatherData;
                fetchForecast(city, unit);
                addToHistory(city);
            } else {
                weatherElement.innerHTML = `<p>${data.message}</p>`;
            }
        })
        .catch(error => {
            weatherElement.innerHTML = `<p>Error fetching weather data. Please try again later.</p>`;
            console.error('Error:', error);
        });
}

// Fetch forecast data
function fetchForecast(city, unit) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`;

    forecastElement.innerHTML = '<p>Loading forecast...</p>'; // Show loading indicator

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "200") {
                let forecastHTML = '';
                const days = {};

                data.list.forEach(item => {
                    const date = new Date(item.dt_txt).toLocaleDateString();
                    if (!days[date]) {
                        days[date] = {
                            temp: item.main.temp,
                            weather: item.weather[0].description,
                            icon: item.weather[0].icon
                        };
                    }
                });

                Object.keys(days).forEach(day => {
                    const { temp, weather, icon } = days[day];
                    forecastHTML += `
                        <div class="forecast-day">
                            <h3>${day}</h3>
                            <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${weather}">
                            <p>Temp: ${temp}°${unit === 'metric' ? 'C' : 'F'}</p>
                            <p>${weather}</p>
                        </div>
                    `;
                });

                forecastElement.innerHTML = forecastHTML;
            } else {
                forecastElement.innerHTML = `<p>${data.message}</p>`;
            }
        })
        .catch(error => {
            forecastElement.innerHTML = `<p>Error fetching forecast data. Please try again later.</p>`;
            console.error('Error:', error);
        });
}

// Add city to search history
function addToHistory(city) {
    const button = document.createElement('button');
    button.textContent = city;
    button.onclick = () => fetchWeather(city, unitSelect.value);
    historyElement.appendChild(button);
}

// Event listeners
document.getElementById('getWeatherBtn').addEventListener('click', function() {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city, unitSelect.value);
    } else {
        weatherElement.innerHTML = '<p>Please enter a city name.</p>';
    }
});

// Event listener for fetching weather and forecast
document.getElementById('getWeatherBtn').addEventListener('click', function() {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city, unitSelect.value);
    } else {
        weatherElement.innerHTML = '<p>Please enter a city name.</p>';
    }
});

// Event listener for fetching weather based on current location
document.getElementById('getCurrentLocationBtn').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unitSelect.value}`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.cod === 200) {
                        const weatherData = `
                            <h2>${data.name}, ${data.sys.country}</h2>
                            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
                            <p>Temperature: ${data.main.temp}°${unitSelect.value === 'metric' ? 'C' : 'F'}</p>
                            <p>Weather: ${data.weather[0].description}</p>
                            <p>Humidity: ${data.main.humidity}%</p>
                            <p>Wind Speed: ${data.wind.speed} m/s</p>
                        `;
                        weatherElement.innerHTML = weatherData;
                        fetchForecast(data.name, unitSelect.value);
                        addToHistory(data.name);
                    } else {
                        weatherElement.innerHTML = `<p>${data.message}</p>`;
                    }
                })
                .catch(error => {
                    weatherElement.innerHTML = `<p>Error fetching weather data. Please try again later.</p>`;
                    console.error('Error:', error);
                });
        });
    } else {
        weatherElement.innerHTML = '<p>Geolocation is not supported by this browser.</p>';
    }
});

// Event listener for unit toggle
unitSelect.addEventListener('change', function() {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city, unitSelect.value);
    }
});
