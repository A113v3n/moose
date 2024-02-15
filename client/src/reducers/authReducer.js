// Importing action types
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from "../actions/types";

// Define the initial state
const initialState = {
  // Get the token from local storage, if it exists
  token: localStorage.getItem("token"),
  // Set 'isAuthenticated' to null, as we don't know yet
  isAuthenticated: null,
  // Set 'loading' to true, as we're waiting for a response
  loading: true,
  // Set 'user' to null, as we don't know who the user is yet
  user: null,
};

const authReducer = (state = initialState, action) => {
  // Destructure type and payload from action
  const { type, payload } = action;

  // switch on the action type
  switch (type) {
    case USER_LOADED:
      // If the user is loaded successfully, set 'isAuthenticated' to true,
      // 'loading' to false, and 'user' to the payload
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      // If registration or login is successful, store the token in local storage,
      // set 'isAuthenticated' to true, and 'loading' to false
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case AUTH_ERROR:
    case LOGOUT:
      // If registration or login fails, or there's an authentication error,
      // or the user logs out, remove the token from local storage,
      // and set 'isAuthenticated' to false, and 'loading' to false
      localStorage.removeItem("token");
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
      };
    default:
      // If the action type doesn't match any cases, return the current state
      return state;
  }
};

// Export the reducer function
export default authReducer;
