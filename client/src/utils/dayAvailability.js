import React from "react";
import TimeRange from "./timeRange";

const DayAvailability = ({
  day,
  timeRanges,
  timeOptions,
  updateTimeRange,
  removeTimeRange,
  addTimeRange,
  isDuplicateTimeRange,
}) => (
  <div>
    <h4>{day}</h4>
    {timeRanges.map((timeRange, index) => (
      <TimeRange
        key={index}
        timeRange={timeRange}
        index={index}
        day={day}
        updateTimeRange={updateTimeRange}
        removeTimeRange={removeTimeRange}
        timeOptions={timeOptions}
      />
    ))}
    <button
      type='button'
      onClick={() => addTimeRange(day)}
      disabled={isDuplicateTimeRange(day, "12:00 AM", "01:00 AM")}
    >
      Add Time Range
    </button>
  </div>
);

export default DayAvailability;
