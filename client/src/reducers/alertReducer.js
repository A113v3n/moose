// Import action types
import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

// Define the initial state of the reducer
const initialState = [];

function alertReducer(state = initialState, action) {
  // Destructure type and payload from action
  const { type, payload } = action;

  // switch on the action type
  switch (type) {
    case SET_ALERT:
      // If the action type is SET_ALERT, return a new state array
      // with the existing state and new payload (the alert message)
      return [...state, payload];
    case REMOVE_ALERT:
      // If the action type is REMOVE_ALERT, return a new state array
      // filtering out the alert message with the id matching the payload
      return state.filter((alert) => alert.id !== payload);
    default:
      // If the action type doesn't match any cases, return the current state
      return state;
  }
}

// Export the reducer function
export default alertReducer;
