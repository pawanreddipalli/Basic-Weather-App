document.getElementById('getWeatherBtn').addEventListener('click', function() {
    const city = document.getElementById('cityInput').value;
    const apiKey = '32a3972b56c5348e4041b68af3289e43'; // Replace with your OpenWeather API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const weatherData = `
                    <h2>${data.name}, ${data.sys.country}</h2>
                    <p>Temperature: ${data.main.temp}°C</p>
                    <p>Weather: ${data.weather[0].description}</p>
                    <p>Humidity: ${data.main.humidity}%</p>
                    <p>Wind Speed: ${data.wind.speed} m/s</p>
                `;
                document.getElementById('weather').innerHTML = weatherData;
            } else {
                document.getElementById('weather').innerHTML = `<p>${data.message}</p>`;
            }
        })
        .catch(error => {
            document.getElementById('weather').innerHTML = `<p>Error fetching weather data. Please try again later.</p>`;
            console.error('Error:', error);
        });
});
