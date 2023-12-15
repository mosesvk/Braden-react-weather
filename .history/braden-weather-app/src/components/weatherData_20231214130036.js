import React, { useState, useEffect, useCallback } from 'react';
import { useCityData } from '../App';
import { sevenDayForecast } from './forecast';
import { timeDateContainer } from './searchFunction';
import { saveLinks } from './utils';

import './weatherData.css';

function getWeatherCodeMessage(weatherCodeJson) {
  let weatherCodeMessage;

  switch (weatherCodeJson) {
    case 0:
      weatherCodeMessage = "Clear Sky's";
      break;
    case 1:
      weatherCodeMessage = "Mostly Clear Sky's";
      break;
    case 2:
      weatherCodeMessage = 'Partly Cloudy';
      break;
    case 3:
      weatherCodeMessage = 'Overcast';
      break;
    case 45:
      weatherCodeMessage = 'Foggy';
      break;
    case 48:
      weatherCodeMessage = 'Depositing Rime Fog';
      break;
    case 51:
      weatherCodeMessage = 'Light Drizzle';
      break;
    case 53:
      weatherCodeMessage = 'Moderate Drizzle';
      break;
    case 55:
      weatherCodeMessage = 'Dense Intense Rain';
      break;
    case 56:
      weatherCodeMessage = 'Light Freezing Drizzle';
      break;
    case 57:
      weatherCodeMessage = 'Dense Intense Freezing Rain';
      break;
    case 61:
      weatherCodeMessage = 'Slight Rain';
      break;
    case 63:
      weatherCodeMessage = 'Moderate Rain';
      break;
    case 65:
      weatherCodeMessage = 'Dense Intense Rain';
      break;
    case 71:
      weatherCodeMessage = 'Light Snowfall';
      break;
    case 73:
      weatherCodeMessage = 'Moderate Snowfall';
      break;
    case 75:
      weatherCodeMessage = 'Heavy Snowfall';
      break;
    case 77:
      weatherCodeMessage = 'Snow Grains';
      break;
    case 80:
      weatherCodeMessage = 'Slight Rain Showers';
      break;
    case 81:
      weatherCodeMessage = 'Moderate Rain Showers';
      break;
    case 82:
      weatherCodeMessage = 'Violent Rain Showers';
      break;
    case 85:
      weatherCodeMessage = 'Slight Snow Showers';
      break;
    case 86:
      weatherCodeMessage = 'Heavy Snow Showers';
      break;
    case 95:
      weatherCodeMessage = 'Thunderstorm';
      break;
    default:
      weatherCodeMessage = '';
      break;
  }
  return weatherCodeMessage;
}

const WeatherAPI = React.memo(() => {
  console.log('WeatherAPI component rendered');
  const { state, dispatch } = useCityData();
  const selectedLocation = state.searchData;
  const [currentWeather, setWeather] = useState(null);
  const [timeZone, setTimeZone] = useState('');
  const [apparentTemp, setApparentTemp] = useState('');
  const memoizedDispatch = useCallback(dispatch, [dispatch]);
  const [weatherCode, setWeatherCode] = useState('');
  const [percipitation, setpercipitation] = useState('');
  const [rain, setRain] = useState('');
  const [snow, setSnow] = useState('');
  const [humidity, setHumdity] = useState('');
  const [windDirection, setwindDirection] = useState('');
  const [windSpeed, setWindSpeed] = useState('');
  const [isDay, setIsDay] = useState('');
  const [UVIndex, setUVIndex] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const [activeDotIndex, setActiveDotIndex] = useState(0);
  const [links, setLinks] = useState();

  const updateFromLocalStorage = useCallback(() => {
    const appData = JSON.parse(localStorage.getItem('appData'));
    setActiveDotIndex(appData.activeDotIndex);
    setClickCount(appData.clickCount);
  }, []);

  useEffect(() => {
    console.log('useEffect 1 is running'); // Add this log
    const appData = JSON.parse(localStorage.getItem('appData'));
    setActiveDotIndex(appData.activeDotIndex);
    setClickCount(appData.clickCount);
  }, [updateFromLocalStorage]);

  function fetchLinkData(link) {
    if (link !== null) {
      fetch(link)
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
            roundedTemperature + ' ' + json.current_units.temperature_2m
          );
          const roundedApparentTemperature = Math.round(
            json.current.apparent_temperature
          );
          setApparentTemp(
            roundedApparentTemperature +
              ' ' +
              json.current_units.apparent_temperature
          );
          const weatherCodeMessage = getWeatherCodeMessage(
            json.current.weather_code
          );
          setWeatherCode(weatherCodeMessage);

          setpercipitation(json.current.precipitation);
          setRain(json.current.rain);
          setSnow(json.current.snow);

          const roundedUVIndex = Math.round(json.current.uv_index);
          setUVIndex(roundedUVIndex);

          const roundedHumidity = Math.round(json.current.relative_humidity_2m);
          setHumdity(roundedHumidity);

          setwindDirection(
            json.current.wind_direction_10m +
              json.current_units.wind_direction_10m
          );
          setWindSpeed(json.current.wind_speed_10m + ' ' + 'MPH');

          setIsDay(json.current.is_day);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }

  useEffect(() => {
    console.log('useEffect 2 is running');

    const localStorageLinks = JSON.parse(localStorage.getItem('links'));
    setLinks(localStorageLinks);

    const appComponentParent = document.querySelector('.locationsContainer');
    const appComponentCount = appComponentParent.children.length;

    localStorageLinks.forEach((link, linkIndex) => {
      if (link !== null) {
        // Add this condition to skip null links
        for (let appIndex = 0; appIndex < appComponentCount; appIndex++) {
          if (linkIndex === appIndex) {
            console.log(
              'Link Index:',
              linkIndex,
              'AppComponent Index:',
              appIndex
            );
            // Fetch the link for the app component
            fetchLinkData(link);
          }
        }
      }
    });
  }, []);
  
  useEffect(() => {
    console.log('useEffect 3 is running'); // Add this log
    if (selectedLocation) {
      const { latitude, longitude } = selectedLocation;
      let apiLink = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,uv_index&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,visibility,uv_index,is_day&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_hours&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto`;

      // Fetch data using the link
      fetchLinkData(apiLink);

      saveLinks(apiLink, activeDotIndex, clickCount);
    }
    // Save null value for the current click count
  }, [selectedLocation]);

  let percipitationMessage;
  let rainMessage;
  let snowMessage;

  if (percipitation === 0) {
    percipitationMessage = 'No precipitation';
  } else {
    if (rain === 0) {
      rainMessage = 'No Rain in the forecast';
    } else {
      rainMessage =
        rain > 1
          ? `${rain} inches of rain are expected`
          : `${rain} inch of rain is expected`;
    }

    if (snow === 0) {
      snowMessage = 'No Snow in the forecast';
    } else {
      snowMessage =
        snow > 1
          ? `${snow} inches of snow are expected`
          : `${snow} inch of snow is expected`;
    }
  }

  return (
    <>
      <div className='currentBody'>
        <div className='currentWeatherBody'>
          <p className='currentWeather'>{currentWeather}</p>
          {apparentTemp && (
            <p className='apparent'>{'Feels like' + ' ' + apparentTemp}</p>
          )}
          <p className='weatherCode'>{weatherCode}</p>
        </div>
        <div className='currentDataContainer'>
          <div className='percipitationContainer'>
            <div className='liquidTop'>
              <i className='fa-solid fa-droplet'></i>
              <p>PERCIPITATION</p>
            </div>
            {percipitation ? (
              <p className='liquid'>
                {rain || snow
                  ? rainMessage || snowMessage
                  : 'No liquid precipitation'}
              </p>
            ) : (
              <p className='liquid'>{percipitationMessage}</p>
            )}
          </div>
          <div className='UvIndexContainer'>
            <div className='UvTop'>
              <i className='fa-solid fa-sun'></i>
              <p>UV INDEX</p>
            </div>
            <p className='UvIndex'>{UVIndex}</p>
          </div>
          <div className='humidityContainer'>
            <div className='humidTop'>
              <i className='fa-solid fa-water'></i>
              <p>HUMIDITY</p>
            </div>
            {humidity && (
              <p className='humidity'>{'Humidity is' + ' ' + humidity + '%'}</p>
            )}{' '}
          </div>
          <div className='windData'>
            <div className='windTop'>
              <i className='fa-solid fa-wind'></i>
              <p>WIND</p>
            </div>
            <p className='windDirection'>{windDirection}</p>
            <p className='windSpeed'>{windSpeed}</p>
          </div>
          {/* <p className="isDay">{isDay}</p> */}
        </div>
      </div>
    </>
  );
})

export default WeatherAPI;
