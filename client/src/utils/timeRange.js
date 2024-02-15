import React from "react";
import moment from "moment";

const TimeRange = ({
  timeRange,
  index,
  updateTimeRange,
  removeTimeRange,
  timeOptions,
  day,
}) => (
  <div className='time-range'>
    <select
      value={timeRange.startTime}
      onChange={(e) => updateTimeRange(day, index, "startTime", e.target.value)}
    >
      {timeOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <select
      value={timeRange.endTime}
      onChange={(e) => updateTimeRange(day, index, "endTime", e.target.value)}
    >
      {timeOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <button onClick={() => removeTimeRange(day, index)}>Remove</button>
  </div>
);

// Utility functions
export const convertToMinutes = (time) => {
  const timeMoment = moment(time, "h:mm A");
  return timeMoment.hours() * 60 + timeMoment.minutes();
};

export const isDuplicateTimeRange = (
  day,
  availability = {},
  newStartTime,
  newEndTime,
  excludeIndex = null
) => {
  const newStartInMinutes = convertToMinutes(newStartTime);
  const newEndInMinutes = convertToMinutes(newEndTime);

  if (!availability[day]) {
    return false;
  }

  return availability[day].some((timeRange, index) => {
    if (index === excludeIndex) {
      return false;
    }

    const rangeStartInMinutes = convertToMinutes(timeRange.startTime);
    const rangeEndInMinutes = convertToMinutes(timeRange.endTime);

    return (
      (newStartInMinutes >= rangeStartInMinutes &&
        newStartInMinutes < rangeEndInMinutes) ||
      (newEndInMinutes > rangeStartInMinutes &&
        newEndInMinutes <= rangeEndInMinutes) ||
      (newStartInMinutes <= rangeStartInMinutes &&
        newEndInMinutes >= rangeEndInMinutes)
    );
  });
};

export const generateTimeOptions = () => {
  const options = [];
  for (let i = 0; i < 24; i++) {
    const hour = i % 12 || 12;
    const ampm = i < 12 ? "AM" : "PM";
    options.push(`${hour}:00 ${ampm}`);
    options.push(`${hour}:30 ${ampm}`);
  }
  return options;
};

export default TimeRange;
