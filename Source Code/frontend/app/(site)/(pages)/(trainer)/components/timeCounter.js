"use client";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

const LiveCounter = ({ clockIn,isCounting }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!clockIn) return;

    const startTime = dayjs(clockIn);
    const updateCounter = () => {
      const now = dayjs();
      const diffInSeconds = now.diff(startTime, "second");
      setElapsedSeconds(diffInSeconds);
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000);

    return () => clearInterval(interval);
  }, [clockIn]);

  const formatTime = (secs) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const remainingSeconds = secs % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  return (
    <div className="text-lg font-medium py-4 text-center">
      ⏳ {formatTime(elapsedSeconds)}
    </div>
  );
};

export default LiveCounter;
