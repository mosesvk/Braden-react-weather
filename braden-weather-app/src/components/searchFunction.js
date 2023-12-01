import { useState, useEffect } from "react";
import { useCityData } from "../App";
import "./searchFunction.css";

export const timeDateContainer = (timeDateData, dispatch) => {
  const timeDateToTransfer = {
    date: timeDateData.date,
    time: timeDateData.time,
  };

  // Dispatch the time and date data to the context
  dispatch({ type: "GET_TIME_DATE", payload: timeDateToTransfer });
  console.log("TimeDateData:", timeDateData);
  console.log(timeDateToTransfer);

  // Return the data that needs to be updated in the state
  return timeDateToTransfer;
};

function SearchFunction() {
  const [location, changeLocation] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");

  useEffect(() => {
    console.log("Formatted Date:", formattedDate);
    console.log("Formatted Time:", formattedTime);
  }, [formattedDate, formattedTime]);

  const { state, dispatch } = useCityData();

  function handleInput(event) {
    changeLocation(event.target.value);
  }

  function handleClick() {
    if (location !== "") {
      fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${location}&language=en&format=json`
      )
        .then((response) => response.json())
        .then((json) => {
          setSearchResults(json.results);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  function chosenLocation(city) {
    setSelectedLocation({
      latitude: city.latitude,
      longitude: city.longitude,
    });

    dispatch({ type: "FETCH_DATA", payload: city });

    // Set the formatted date and time directly in the component's state
    const dateOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const formattedDate = new Date().toLocaleString("en-US", dateOptions);
    const formattedTime = new Date().toLocaleString("en-US", timeOptions);
    setFormattedDate(formattedDate);
    setFormattedTime(formattedTime);

    // Clear input value
    changeLocation("");
    // Clear search results
    setSearchResults([]);
  }

  return (
    <>
      <div className="searchData">
        <div className="searchBarContainer">
          <input
            placeholder={"Enter Location..."}
            onChange={handleInput}
            value={location}
          ></input>
          <button className="searchButton" onClick={handleClick}>
            Search
          </button>
        </div>
        <div className="cityNames">
          <ul className="ulContainer">
            {searchResults &&
              searchResults.map((city) => {
                const admins = [
                  city.admin1,
                  city.admin2,
                  city.admin3,
                  city.admin4,
                ]
                  .filter(Boolean)
                  .filter(
                    (value, index, self) => self.indexOf(value) === index
                  );

                if (admins.length > 0) {
                  return (
                    <li className="citiesToChoose" key={city.id}>
                      <p>
                        {city.name}, {admins.join(", ")}
                      </p>
                      <button
                        className="add"
                        onClick={() => chosenLocation(city)}
                      >
                        +
                      </button>
                    </li>
                  );
                }

                return null;
              })}
          </ul>
        </div>
        <div className="timeDate">
          <div className="date">
            <p>{formattedDate}</p>
          </div>
          <div className="time">
            <p>{formattedTime}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchFunction;
