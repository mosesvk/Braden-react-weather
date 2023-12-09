import React, { useState, useEffect } from "react";
import { useCityData } from "../App";
import "./forecast.css";

// Define the function outside the component
export const sevenDayForecast = (tempData, dispatch) => {
  return new Promise((resolve, reject) => {
    const forecastData = {
      forecastMax: tempData.forecastMax,
      forecastMin: tempData.forecastMin,
    };

    // Dispatch the forecast data to the context
    dispatch({ type: "GET_FORECAST", payload: forecastData });

    // Resolve the promise with the forecast data
    resolve(forecastData);
  });
};

function WeekForecast({ selectedLocation }) {
  const [nextDays, setNextDays] = useState([]);
  const { state, dispatch } = useCityData();

  useEffect(() => {
    const today = new Date();
    const nextDaysArray = [];
    for (let i = 1; i <= 7; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      const formattedNextDay = nextDay.toLocaleDateString("en-US", {
        weekday: "long",
      });
      nextDaysArray.push(formattedNextDay);
    }
    setNextDays(nextDaysArray);

    if (selectedLocation) {
      // Call sevenDayForecast function to update the forecast state
      sevenDayForecast({}, dispatch).then(() => {
        // The data is dispatched to the context, no need to update local state
      });
    }
  }, [dispatch, selectedLocation]);

  return state.forecastData ? (
    <>
      <div className="forecastBody">
        <ul className="weekForecast">
          {Array.isArray(nextDays) &&
            nextDays.map((day, index) => (
              <li className="weekDay" key={index}>
                <div className="dayName">{day}</div>
                <div className="temp">
                  <p>{state.forecastData?.forecastMax?.[index]}</p>
                  <p>{state.forecastData?.forecastMin?.[index]}</p>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </>
  ) : (
    <><div className="forecastBody"></div></>
  );
}

export default WeekForecast;