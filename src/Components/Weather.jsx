import axios from "axios";
import React, { useState } from "react";
import Error from "./Error"; // Assuming the Error component is in the same folder

const Weather = () => {
  const [searchData, setSearchData] = useState("");
  const [weatherData, setWeatherData] = useState({});
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

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

  const weatherDetails = async (city) => {
    try {
      const query = city || searchData;
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=0d5b600becf1e8bb85577822891fe40d&units=metric`
      );
      if (!res) {
        throw new Error("Enter a valid place");
      }
      const jsonData = res.data;
      requiredWeatherData.cityName = jsonData?.name;
      requiredWeatherData.currentTemperature = jsonData?.main?.temp;
      requiredWeatherData.weatherCondition = jsonData?.weather[0]?.main;
      requiredWeatherData.humidity = jsonData?.main?.humidity;
      requiredWeatherData.windSpeed = jsonData?.wind?.speed;
      requiredWeatherData.weatherIcon = jsonData?.weather[0]?.icon;
      requiredWeatherData.showLoadingState = false;
      requiredWeatherData.isError = false;

      // Update weather data
      setWeatherData(requiredWeatherData);
      setError(""); // Clear any previous errors

      // Update history
      setHistory((prevHistory) => {
        const updatedHistory = [...prevHistory];
        if (!updatedHistory.includes(requiredWeatherData.cityName)) {
          if (updatedHistory.length < 5) {
            updatedHistory.push(requiredWeatherData.cityName);
          } else {
            updatedHistory.shift(); // Remove the first (oldest) entry
            updatedHistory.push(requiredWeatherData.cityName);
          }
        }
        return updatedHistory;
      });
    } catch (err) {
      console.log(err);
      setError("Please enter a valid place.");
    }
  };

  return (
    <div className="h-lvh w-full bg-blue-300">
      {/* If there's an error, render the Error component */}
      {error ? (
        <Error />
      ) : (
        <div>
          <div className="flex justify-center p-8">
            <input
              type="text"
              value={searchData}
              onChange={(e) => {
                setSearchData(e.target.value);
              }}
              placeholder="Type here"
              className="input rounded-2xl"
            />
            <div className="mx-5 flex">
              <button
                onClick={() => weatherDetails()}
                className="btn rounded-2xl mx-2"
              >
                Submit
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-gray-200 rounded-lg shadow-md">
            <h1 className="text-4xl font-bold text-gray-800">
              Weather Details
            </h1>

            <div className="flex flex-wrap justify-center space-x-6 space-y-4">
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
                <h2 className="text-amber-100 text-xl font-serif">Humidity</h2>
                <p className="text-amber-50 text-2xl">
                  {weatherData?.humidity || "N/A"}%
                </p>
              </div>

              <div className="bg-cyan-600 p-4 rounded-lg shadow-md text-center">
                <h2 className="text-amber-100 text-xl font-serif">Condition</h2>
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

          {/* Display history */}
          {history.length > 0 && (
            <div className="p-4 bg-white mt-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold">Recent Searches</h3>
              <ul className="list-disc pl-6">
                {history.map((city, index) => (
                  <li
                    key={index}
                    className="text-blue-500 cursor-pointer"
                    onClick={() => {
                      setSearchData(city);
                      weatherDetails(city); // Fetch weather for clicked city
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
  );
};

export default Weather;