import React from "react";
import { useRoutes } from "react-router-dom";
import LocationSelector from "../../booking/LocationSelector";
import DurationSelector from "../../booking/DurationSelector";
import DateSelector from "../../booking/DateSelector";
import TimeSelector from "../../booking/TimeSelector";
import BookingConfirmation from "../../booking/BookConfirmation";

const UserDashboard = () => {
  const userRoutes = useRoutes([
    {
      path: "location",
      element: <LocationSelector />
    },
    {
      path: "duration",
      element: <DurationSelector />
    },
    {
      path: "date",
      element: <DateSelector />
    },
    {
      path: "time",
      element: <TimeSelector />
    },
    {
      path: "confirmation",
      element: <BookingConfirmation />
    },
  ]);

  return <div>{userRoutes}</div>;
};


export default UserDashboard;
