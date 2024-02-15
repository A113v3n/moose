// Import the v4 function from the uuid library and rename it to uuidv4.
// This library generates unique IDs which we will use for our alerts.
import { v4 as uuidv4 } from 'uuid';

// Import the types of actions we will dispatch.
import { SET_ALERT, REMOVE_ALERT } from './types';

// setAlert is a function that dispatches two actions: one to set an alert, and one to remove it after a specified timeout.
export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
  // Generate a unique ID for this alert.
  const id = uuidv4();

  // Dispatch an action of type SET_ALERT. The payload contains the message, the type of alert, and the unique ID we just generated.
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id }
  });

  // After the specified timeout (default is 5000 milliseconds or 5 seconds), dispatch an action of type REMOVE_ALERT. The payload is the unique ID of the alert.
  // This will be used by the reducer to know which alert to remove.
  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
