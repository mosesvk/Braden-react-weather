import React, { useState, useEffect, useCallback } from 'react';
import { useCityData } from '../App';
import WeatherFetcher from './WeatherFetcher';

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
    if (selectedLocation) {
      const { latitude, longitude } = selectedLocation;
      let apiLink = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,uv_index&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,visibility,uv_index,is_day&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_hours&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto`;

      // Use the WeatherFetcher component to fetch data
      return <WeatherFetcher key={apiLink} link={apiLink} dispatch={dispatch} />;
    }
  }, [selectedLocation, dispatch]);

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
