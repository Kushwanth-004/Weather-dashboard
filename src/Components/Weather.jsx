import axios from "axios";
import React, { useState, useEffect } from "react";
import Error from "./Error";

const Weather = () => {
  const [searchData, setSearchData] = useState("");
  const [weatherData, setWeatherData] = useState({});
  const [forecastData, setForecastData] = useState([]); // State to store forecast data
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const requiredWeatherData = {
    cityName: null,
    currentTemperature: null,
    weatherCondition: null,
    humidity: null,
    windSpeed: null,
    weatherIcon: null,
    showLoadingState: null,
    isError: null,
  };

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Fetch current weather and 5-day forecast
  const weatherDetails = async (city) => {
    setLoading(true);
    try {
      const query = city || searchData;

      // Fetch current weather
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=0d5b600becf1e8bb85577822891fe40d&units=metric`
      );
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=0d5b600becf1e8bb85577822891fe40d&units=metric`
      );

      if (!weatherRes || !forecastRes) {
        throw new Error("Enter a valid place");
      }

      const weatherData = weatherRes.data;
      requiredWeatherData.cityName = weatherData?.name;
      requiredWeatherData.currentTemperature = weatherData?.main?.temp;
      requiredWeatherData.weatherCondition = weatherData?.weather[0]?.main;
      requiredWeatherData.humidity = weatherData?.main?.humidity;
      requiredWeatherData.windSpeed = weatherData?.wind?.speed;
      requiredWeatherData.weatherIcon = weatherData?.weather[0]?.icon;
      requiredWeatherData.showLoadingState = false;
      requiredWeatherData.isError = false;

      setWeatherData(requiredWeatherData);
      setError("");

      // Process 5-day forecast data
      const forecastList = forecastRes.data.list;
      const dailyForecast = [];

      // Loop through the forecast data and pick a representative time (e.g., midday) for each day
      for (let i = 0; i < forecastList.length; i += 8) {
        const dayData = forecastList[i]; // Picking data in 3-hour intervals, skipping 8 elements to get roughly 1 per day
        dailyForecast.push({
          date: dayData.dt_txt.split(" ")[0], // Get the date part
          temp: dayData.main.temp,
          condition: dayData.weather[0].main,
          icon: dayData.weather[0].icon,
        });
      }
      setForecastData(dailyForecast);

      // Update search history
      setHistory((prevHistory) => {
        const updatedHistory = [...prevHistory];
        if (!updatedHistory.includes(requiredWeatherData.cityName)) {
          if (updatedHistory.length < 5) {
            updatedHistory.push(requiredWeatherData.cityName);
          } else {
            updatedHistory.shift();
            updatedHistory.push(requiredWeatherData.cityName);
          }
        }
        return updatedHistory;
      });
    } catch (err) {
      console.log(err);
      setError("Please enter a valid place.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      weatherDetails();
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div
      className={`min-h-screen w-full ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-blue-300 text-black"
      }`}
    >
      {error ? (
        <Error />
      ) : (
        <div>
          <div className="flex justify-end p-6">
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-full bg-gray-300 dark:bg-gray-800 text-black dark:text-white"
            >
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>

          <div className="flex justify-center p-8">
            <input
              type="text"
              value={searchData}
              onChange={(e) => {
                setSearchData(e.target.value);
              }}
              onKeyPress={handleKeyPress}
              placeholder="Type here"
              className="input rounded-2xl dark:bg-gray-700 dark:text-white px-4 py-2"
            />
            <div className="mx-5 flex">
              <button
                onClick={() => weatherDetails()}
                className="btn bg-blue-500 hover:bg-blue-600 rounded-2xl mx-2 text-white px-4 py-2"
              >
                Submit
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
          ) : (
            <div>
              {/* Weather Details */}
              <div
                className={`flex flex-col items-center justify-center space-y-4 p-6 ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                } rounded-lg shadow-md`}
              >
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                  Weather Details
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="bg-cyan-600 p-4 rounded-lg shadow-md text-center">
                    <h2 className="text-amber-100 text-xl font-serif">City</h2>
                    <p className="text-amber-50 text-2xl">
                      {weatherData?.cityName || "N/A"}
                    </p>
                  </div>

                  <div className="bg-cyan-600 p-4 rounded-lg shadow-md text-center">
                    <h2 className="text-amber-100 text-xl font-serif">
                      Temperature
                    </h2>
                    <p className="text-amber-50 text-2xl">
                      {weatherData?.currentTemperature || "N/A"}°C
                    </p>
                  </div>

                  <div className="bg-cyan-600 p-4 rounded-lg shadow-md text-center">
                    <h2 className="text-amber-100 text-xl font-serif">
                      Humidity
                    </h2>
                    <p className="text-amber-50 text-2xl">
                      {weatherData?.humidity || "N/A"}%
                    </p>
                  </div>

                  <div className="bg-cyan-600 p-4 rounded-lg shadow-md text-center">
                    <h2 className="text-amber-100 text-xl font-serif">
                      Condition
                    </h2>
                    <p className="text-amber-50 text-2xl">
                      {weatherData?.weatherCondition || "N/A"}
                    </p>
                  </div>

                  <div className="bg-cyan-600 p-4 rounded-lg shadow-md text-center">
                    <h2 className="text-amber-100 text-xl font-serif">
                      Wind Speed
                    </h2>
                    <p className="text-amber-50 text-2xl">
                      {weatherData?.windSpeed || "N/A"} m/s
                    </p>
                  </div>

                  <div className="bg-cyan-600 p-4 rounded-lg shadow-md text-center">
                    <h2 className="text-amber-100 text-xl font-serif">
                      Weather Icon
                    </h2>
                    {weatherData?.weatherIcon && (
                      <img
                        src={`http://openweathermap.org/img/w/${weatherData.weatherIcon}.png`}
                        alt="weather icon"
                        className="h-16 w-16 mx-auto"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* 5-Day Forecast */}
              {forecastData.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-center text-3xl font-bold">
                    5-Day Forecast
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6 mt-6">
                    {forecastData.map((forecast, index) => (
                      <div
                        key={index}
                        className="bg-blue-400 p-4 rounded-lg text-center"
                      >
                        <p className="text-xl font-bold">{forecast.date}</p>
                        <p className="text-2xl">{forecast.temp}°C</p>
                        <p className="text-xl">{forecast.condition}</p>
                        <img
                          src={`http://openweathermap.org/img/w/${forecast.icon}.png`}
                          alt="forecast icon"
                          className="h-12 w-12 mx-auto"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Searches */}
              {history.length > 0 && (
                <div className="p-4 bg-white dark:bg-gray-800 mt-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold dark:text-black">
                    Recent Searches
                  </h3>
                  <ul className="list-disc pl-6">
                    {history.map((city, index) => (
                      <li
                        key={index}
                        className="text-blue-500 dark:text-blue-400 cursor-pointer"
                        onClick={() => {
                          setSearchData(city);
                          weatherDetails(city);
                        }}
                      >
                        {city}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Weather;
