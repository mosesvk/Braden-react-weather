import React, { useState, useEffect, useCallback } from "react";
import { useCityData } from "../App";
import { sevenDayForecast } from "./forecast";
import { timeDateContainer } from "./searchFunction";
import { useDayOrNightContext } from "./DayOrNight";
import "./weatherData.css";

function WeatherAPI() {
    const { state, dispatch } = useCityData(); 
    const selectedLocation = state.searchData;
  const [currentWeather, setWeather] = useState(null);
  const [timeZone, setTimeZone] = useState("");

  const memoizedDispatch = useCallback(dispatch, [dispatch]);

  useEffect(() => {
    if (selectedLocation) {
      const { latitude, longitude } = selectedLocation;

      // Fetch weather data
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,cloud_cover,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,visibility,uv_index,is_day&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_hours&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto`
      )
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          const time = json.timezone;
          // Format the date and time
          const updatedTimeDateData = timeDateContainer(
            { timeZone: time },
            dispatch
          );

          // Update the state with the returned data
          setTimeZone(updatedTimeDateData.timeZone);

          if (
            json.daily &&
            json.daily.temperature_2m_min &&
            json.daily.temperature_2m_max
          ) {
            const min = json.daily.temperature_2m_min;
            const max = json.daily.temperature_2m_max;

            const roundedMin = min.map((temp) =>
              temp ? Math.round(temp) : null
            );
            const roundedMax = max.map((temp) =>
              temp ? Math.round(temp) : null
            );

            // Dispatch the forecast data to the context
            sevenDayForecast(
              { forecastMin: roundedMin, forecastMax: roundedMax },
              dispatch
            );
          }

          const roundedTemperature = Math.round(json.current.temperature_2m);
          setWeather(
            roundedTemperature + " " + json.current_units.temperature_2m
          );
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }, [selectedLocation, dispatch]);

  return (
    <>
      <div className="currentBody">
        <div className="currentWeatherBody">
          <p className="currentWeather">{currentWeather}</p>
        </div>
      </div>
    </>
  );
}

export default WeatherAPI;
