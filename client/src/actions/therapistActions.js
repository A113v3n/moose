// Import axios for making HTTP requests
import axios from 'axios';

// Import setAlert action to show alerts
import { setAlert } from './alertActions';

// Import action types
import {
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE,
} from './types';

// Define getProfile action to fetch the current user's profile
export const getProfile = () => async (dispatch) => {
  try {
    // Make a GET request to fetch the profile data
    const res = await axios.get('/api/profile/me'); // Modify this to your own API endpoint

    // Dispatch the GET_PROFILE action with the received data
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    // If there's an error, dispatch PROFILE_ERROR with the error message and status
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Define updateProfile action to update the current user's profile
export const updateProfile = (formData) => async (dispatch) => {
  try {
    // Define headers for the POST request
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Make a POST request to update the profile data
    const res = await axios.post('/api/therapist', formData, config);

    // Dispatch the UPDATE_PROFILE action with the received data
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    // Dispatch setAlert action to show a success message
    dispatch(setAlert('Profile Updated', 'success'));
  } catch (err) {
    // If there are any errors in the response, dispatch setAlert for each error message
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    // If there's an error, dispatch PROFILE_ERROR with the error message and status
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
