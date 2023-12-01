import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useReducer,
  useContext,
} from "react";
import "./App.css";
import SearchFunction from "./components/searchFunction";
import WeekForecast from "./components/forecast";
import WeatherAPI from "./components/weatherData";
import { DayOrNightProvider } from "./components/DayOrNight";

export const dataReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_DATA":
      return {
        ...state,
        searchData: action.payload,
      };
    case "GET_FORECAST":
      return {
        ...state,
        forecastData: action.payload,
      };
    case "GET_TIME_DATE":
      return {
        ...state,
        timeDateData: action.payload,
      };
    default:
      return state;
  }
};

export const cityDataContext = createContext(null);

export const CityDataProvider = ({ children }) => {
  const initialState = {
    searchData: null,
  };

  const [state, dispatch] = useReducer(dataReducer, initialState);

  return (
    <cityDataContext.Provider value={{ state, dispatch }}>
      {children}
    </cityDataContext.Provider>
  );
};

export const useCityData = () => {
  return useContext(cityDataContext);
};

export const appDataContext = createContext(null);

export const AppDataProvider = ({ children, index }) => {
  const initialState = {
    searchData: null,
    locationData: null,
  };

  const [state, dispatch] = useReducer(dataReducer, initialState);

  return (
    <appDataContext.Provider value={{ state, dispatch }}>
      {children}
    </appDataContext.Provider>
  );
};

export const useAppData = () => {
  return useContext(appDataContext);
};

const AppInstance = ({ index }) => {
  return (
    <CityDataProvider>
      <div id={`app-${index}`} className="App">
        <div className="leftComponents">
          <SearchFunction />
          <WeekForecast />
        </div>
        <div className="rightComponents">
          <WeatherAPI />
        </div>
      </div>
    </CityDataProvider>
  );
};

function App() {
  const [clickCount, setClickCount] = useState(0);
  const [activeDotIndex, setActiveDotIndex] = useState(0);
  const dotsContainerRef = useRef(null);

  //handling button to add location components

  function handleButtonClick() {
    setClickCount(clickCount + 1);
  }

  //clicking the dots and dot logic

  function handleDotClick(index) {
    setActiveDotIndex(index);
    const targetElement = document.getElementById(`app-${index}`);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }

  //handle user scrolling and updating current active dot
  function handleScroll() {
    if (!dotsContainerRef.current) return;

    const scrollPosition = dotsContainerRef.current.scrollLeft;
    //const containerWidth = dotsContainerRef.current.clientWidth;
    const appWidth = dotsContainerRef.current.querySelector(".App").offsetWidth;

    const activeIndex = Math.round(scrollPosition / appWidth);

    setActiveDotIndex(activeIndex);
  }

  useEffect(() => {
    window.addEventListener("wheel", handleScroll);

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [clickCount]);

  //jsx return
  return (
    <>
      <div className="buttonDots">
        <div className="dots">
          {Array.from({ length: clickCount }, (_, index) => (
            <div
              key={index}
              className={`dot ${index === activeDotIndex ? "active" : ""}`}
              onClick={() => handleDotClick(index)}
            ></div>
          ))}
        </div>
        <div className="button">
          <input
            type="button"
            value={"Add Component"}
            onClick={handleButtonClick}
          ></input>
        </div>
      </div>
      <div className="locationsAdded" ref={dotsContainerRef}>
        <div className="locationsContainer">
          {[...Array(clickCount)].map((_, index) => (
            <AppInstance key={index} index={index} />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
