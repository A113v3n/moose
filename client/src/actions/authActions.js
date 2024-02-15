// Importing required modules
import axios from "axios";  // Axios is a promise-based HTTP client for the browser and node.js
import { setAlert } from "./alertActions";  // Action for setting alerts
import { useNavigate } from 'react-router-dom';
import {  // Importing action types
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from "./types";
import setAuthToken from "../utils/setAuthToken";  // Helper function to set token in header

// Load User
export const loadUser = () => async (dispatch) => {
  // check if there's a token in local storage and set it in the header
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  
  try {
    // Make a GET request to /api/auth to load user data
    const res = await axios.get("/api/auth");

    // Dispatch USER_LOADED action to set user data in the state
    dispatch({
      type: USER_LOADED,       
      payload: res.data,  // user data
    });

  } catch (err) {
    // If there's an error, dispatch AUTH_ERROR action
    dispatch({
      type: AUTH_ERROR,
    });
  }
};



// Register User
export const register = ({
  // This function takes a set of user data
  accountType,
  firstName,
  lastName,
  email,
  password,
  // ... additional user information
}) => async (dispatch) => {
  // Config for axios
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  
  // Convert data to JSON
  const body = JSON.stringify({
    accountType,
    firstName,
    lastName,
    email,
    password,
    // ... additional user information
  });
  
  try {
    // Make a POST request to register a new user
    const res = await axios.post(
      accountType === 2 ? "/api/therapist/register" : "/api/users",
      body,
      config
    );
  
    // If registration is successful, dispatch REGISTER_SUCCESS action
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,  // user data
    });
    
    // Load the user data
    dispatch(loadUser());
  } catch (err) {
    // If there's an error, log it and dispatch REGISTER_FAIL action
    console.error(err.response.data);  // Log the error message
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
  
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Login User
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  
  const body = JSON.stringify({
    email,
    password,
  });
  
  try {
    // Make a POST request to log in the user
    const res = await axios.post("/api/auth", body, config);
  
    // If login is successful, dispatch LOGIN_SUCCESS action
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,  // user data
    });

  // Load the user data
  dispatch(loadUser());
  } catch (err) {
    // If there's an error, log it and dispatch LOGIN_FAIL action
    const errors = err.response.data.errors;
    if (errors) {
      // Loop through the errors and dispatch an alert action for each one
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
  
    // Dispatch LOGIN_FAIL action to indicate that the login process has failed
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout / Clear Profile
export const logout = () => (dispatch) => {
  // Dispatch LOGOUT action to clear user data from the state
  // This is usually used when a user logs out of the application
  dispatch({ type: LOGOUT });
};