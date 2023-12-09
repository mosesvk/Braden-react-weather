import React, { useState, useEffect } from "react";

const TimeZoneClock = React.memo(({ timeZone }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const DateOptions = {
    timeZone: timeZone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const TimeOptions = {
    timeZone: timeZone,
    hour: "numeric",
    minute: "numeric",
  };

  const formattedTime = currentTime.toLocaleString("en-US", TimeOptions);
  const formattedDate = currentTime.toLocaleString("en-US", DateOptions);

  return timeZone ? (
    <div className="timeDate">
      <div className="date">
        <p>{formattedDate}</p>
      </div>
      <div className="time">
        <p>{formattedTime}</p>
      </div>
    </div>
  ) : (
    <div className="timeDate">
      <div className="date">
        <p></p>
      </div>
      <div className="time">
        <p></p>
      </div>
    </div>
  );
});

export default TimeZoneClock;