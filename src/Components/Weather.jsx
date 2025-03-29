import axios from "axios";
import React, { useEffect, useState } from "react";

const Weather = () => {
  const [searchData, setSearchData] = useState("");

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
  const weatherDetails = async () => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchData}&appid=0d5b600becf1e8bb85577822891fe40d&units=metric`
      );

      const jsonData = res.data;
      requiredWeatherData.cityName = jsonData?.name;
      requiredWeatherData.currentTemperature = jsonData?.main?.temp;
      requiredWeatherData.weatherCondition = jsonData?.weather[0]?.main;
      requiredWeatherData.humidity = jsonData?.main?.humidity;
      requiredWeatherData.windSpeed = jsonData?.wind?.speed;
      requiredWeatherData.weatherIcon = jsonData?.weather[0]?.icon;
      requiredWeatherData.showLoadingState = false;
      requiredWeatherData.isError = false;
      console.log(requiredWeatherData);
    } catch (err) {
      console.log(err.message);
    }
  };
  //   useEffect(() => {
  //     weatherDetails();
  //   }, []);
  return (
    <div>
      <input
        type="text"
        value={searchData}
        onChange={(e) => {
          setSearchData(e.target.value);
        }}
        placeholder="Type here"
        className="input"
      />
      <button onSubmit={weatherDetails} className="btn">
        submit
      </button>
      <h1>{requiredWeatherData?.name}</h1>
    </div>
  );
};

export default Weather;
