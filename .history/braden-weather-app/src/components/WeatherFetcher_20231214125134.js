import React, { useState, useEffect, useCallback } from 'react';
import { timeDateContainer } from './searchFunction';
import { sevenDayForecast } from './forecast';
import { saveLinks } from './utils';

const WeatherFetcher = ({ link, dispatch }) => {
    const [weatherData, setWeatherData] = useState(null);
  
    const fetchLinkData = useCallback(() => {
      fetch(link)
        .then((response) => response.json())
        .then((json) => {
          const time = json.timezone;
          const updatedTimeDateData = timeDateContainer({ timeZone: time }, dispatch);
  
          setWeatherData({
            timeZone: updatedTimeDateData.timeZone,
            currentTemperature: Math.round(json.current.temperature_2m),
            // ... other data
          });
  
          if (json.daily && json.daily.temperature_2m_min && json.daily.temperature_2m_max) {
            const min = json.daily.temperature_2m_min;
            const max = json.daily.temperature_2m_max;
            const roundedMin = min.map((temp) => (temp ? Math.round(temp) : null));
            const roundedMax = max.map((temp) => (temp ? Math.round(temp) : null));
  
            sevenDayForecast({ forecastMin: roundedMin, forecastMax: roundedMax }, dispatch);
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    }, [link, dispatch]);
  
    useEffect(() => {
      fetchLinkData();
    }, [fetchLinkData]);
  
    useEffect(() => {
      if (weatherData) {
        // Handle the data as needed
        saveLinks(link, weatherData);
      }
    }, [weatherData, link]);
  
    return null; // or a loading indicator if needed
  };
  

  export default WeatherFetcher;
