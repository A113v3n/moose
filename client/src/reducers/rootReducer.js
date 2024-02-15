import { combineReducers } from "redux";
import alert from "./alertReducer";
import auth from "./authReducer";
import profile from "./therapistReducer";
import booking from "./bookingReducer"; // Import the bookingReducer

export default combineReducers({
  alert,
  auth,
  profile,
  booking, // Add the booking reducer to the root reducer
});
