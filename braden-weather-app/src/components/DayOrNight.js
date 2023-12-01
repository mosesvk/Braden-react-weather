import React, { createContext, useContext, useState} from "react";

const DayOrNightContext = createContext();

export const DayOrNightProvider = ({ children }) => {
    const [isDay, setIsDay] = useState([]);

    const contextValue = {
        isDay, 
        setIsDay,
    };

    return <DayOrNightContext.Provider value={contextValue}>{children}</DayOrNightContext.Provider>
};

export const useDayOrNightContext = () => useContext(DayOrNightContext);