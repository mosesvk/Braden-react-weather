import { useState } from "react";
import { useCityData } from "../App";
import TimeZoneClock from "./timezone";
import "./searchFunction.css";

export const timeDateContainer = (timeDateData, dispatch) => {
  const timeDateToTransfer = {
    timeZone: timeDateData.timeZone,
  };

  // Dispatch the time and date data to the context
  dispatch({ type: "GET_TIME_DATE", payload: timeDateToTransfer });

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
  const [timeZone, setTimeZone] = useState("");

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
    const CityTimeZone = `${city?.timezone}`; 
    setTimeZone(CityTimeZone);
    setSelectedLocation({
      latitude: city.latitude,
      longitude: city.longitude,
    });

    dispatch({ type: "FETCH_DATA", payload: city });

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
        <TimeZoneClock timeZone={timeZone ? timeZone : undefined } />
      </div>
    </>
  );
}

export default SearchFunction;
