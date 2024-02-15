import {
    FETCH_LOCATIONS_REQUEST,
    FETCH_LOCATIONS_SUCCESS,
    FETCH_LOCATIONS_FAILURE,
    SET_SELECTED_LOCATION,
    SET_SELECTED_DURATION,
    SET_SELECTED_DATE,
    FETCH_TIME_SLOTS_REQUEST,
    FETCH_TIME_SLOTS_SUCCESS,
    FETCH_TIME_SLOTS_FAILURE,
    CREATE_BOOKING_REQUEST,
    CREATE_BOOKING_SUCCESS,
    CREATE_BOOKING_FAILURE,
    FETCH_THERAPISTS_REQUEST,
    FETCH_THERAPISTS_SUCCESS,
    FETCH_THERAPISTS_FAILURE,
    FETCH_BOOKING_REQUEST,
    FETCH_BOOKING_SUCCESS,
    FETCH_BOOKING_FAILURE
  } from './types';
  import { setAlert } from "./alertActions";  // Action for setting alerts
  import axios from 'axios';
  import moment from 'moment'; 
  import { format } from 'date-fns';
// BEGINNING OF FETCH LOCATIONS FUNCTION
  export const fetchLocations = () => {
    return (dispatch) => {
      dispatch(fetchLocationsRequest());
      axios
        .get('/api/locations')
        .then((response) => {
          dispatch(fetchLocationsSuccess(response.data));
        })
        .catch((error) => {
          dispatch(fetchLocationsFailure(error.message));
        });
    };
  };
  
  const fetchLocationsRequest = () => {
    return {
      type: FETCH_LOCATIONS_REQUEST,
    };
  };
  
  const fetchLocationsSuccess = (locations) => {
    return {
      type: FETCH_LOCATIONS_SUCCESS,
      payload: locations,
    };
  };
  
  const fetchLocationsFailure = (error) => {
    return {
      type: FETCH_LOCATIONS_FAILURE,
      payload: error,
    };
  };
  
  export const setSelectedLocation = (locationId) => {
    return async (dispatch, getState) => {
      // Dispatch the action to set the locationId in the state.
      dispatch({
        type: 'SET_SELECTED_LOCATION',
        payload: locationId,
      });
      
      // Return a resolved promise after the state update.
      return Promise.resolve();
    };
  };
  
// BEGINNING OF FETCH THERAPIST FUNCTION
  export const fetchTherapistsSuccess = (therapists) => {

    return {
      type: FETCH_THERAPISTS_SUCCESS,
      payload: therapists,
    };
  };
  
  export const fetchTherapists = () => {
    return (dispatch) => {
      dispatch(fetchTherapistsRequest());
      axios
        .get('/api/gettherapist/therapists')
        .then((response) => {

          dispatch(fetchTherapistsSuccess(response.data));
        })
        .catch((error) => {
          dispatch(fetchTherapistsFailure(error.message));
        });
    };
  };
  
  const fetchTherapistsRequest = () => {
    return {
      type: FETCH_THERAPISTS_REQUEST,
    };
  };
  
  const fetchTherapistsFailure = (error) => {
    return {
      type: FETCH_THERAPISTS_FAILURE,
      payload: error,
    };
  };
  // BEGINNING OF SETTING BOOKING (DURATION, DATE, TIME SLOT) FUNCTION
  export const setSelectedDuration = (duration) => {
    return {
      type: SET_SELECTED_DURATION,
      payload: duration,
    };
  };
  
  export const setSelectedDate = (date) => {
    return {
      type: SET_SELECTED_DATE,
      payload: date,
    };
  };
  
  export const fetchTimeSlots = (locationId, duration, date) => {
    // Get the user's timezone
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    let formattedDate = moment(date).format('YYYY-MM-DD');

    return (dispatch) => {
      dispatch(fetchTimeSlotsRequest());
      axios
        .get(`/api/availability?locationId=${locationId}&duration=${duration}&date=${formattedDate}&userTimeZone=${userTimeZone}`)
        .then((response) => {
          dispatch(fetchTimeSlotsSuccess(response.data));
        })
        .catch((error) => {
          dispatch(fetchTimeSlotsFailure(error.message));
        });
    };
  };
  
  const fetchTimeSlotsRequest = () => {
    return {
      type: FETCH_TIME_SLOTS_REQUEST,
    };
  };
  
  const fetchTimeSlotsSuccess = (timeSlots) => {
    return {
      type: FETCH_TIME_SLOTS_SUCCESS,
      payload: timeSlots,
    };
  };
  
  const fetchTimeSlotsFailure = (error) => {
    return {
      type: FETCH_TIME_SLOTS_FAILURE,
      payload: error,
    };
  };
// BEGINNING OF CREATE BOOKING FUNCTION  
export const createBooking = (locationId, duration, date, timeSlot) => {
  // Extract the necessary properties from the timeSlot object.
  const { start, end, roomId, therapistId } = timeSlot;

  return (dispatch) => {
    dispatch(createBookingRequest());
    axios
      .post('/api/bookings', { locationId, duration, date, roomId, therapistId, start, end })
      .then((response) => {
        dispatch(createBookingSuccess(response.data));
      })
      .catch((error) => {
        // If there is an error, set an alert with the error message
        dispatch(setAlert(error.response.data.error, 'danger'));
        dispatch(createBookingFailure(error.message));
      });
  };
};
  
  const createBookingRequest = () => {
    return {
      type: CREATE_BOOKING_REQUEST,
    };
  };
  
  const createBookingSuccess = (booking) => {

    return {
      type: CREATE_BOOKING_SUCCESS,
      payload: booking,
    };
  };
  
  const createBookingFailure = (error) => {
    return {
      type: CREATE_BOOKING_FAILURE,
      payload: error,
    };
  };
  
  export const fetchBooking = (bookingId) => {
    return (dispatch) => {
      dispatch(fetchBookingRequest());
      axios
        .get('/api/bookings/user-bookings')
        .then((response) => {
          const booking = response.data.bookings.find(
            (booking) => booking._id === bookingId
          );
          if (booking) {
            dispatch(fetchBookingSuccess(booking));
          } else {
            dispatch(fetchBookingFailure('Booking not found'));
          }
        })
        .catch((error) => {
          dispatch(fetchBookingFailure(error.message));
        });
    };
  };
  
  
  const fetchBookingRequest = () => {
    return {
      type: FETCH_BOOKING_REQUEST,
    };
  };
  
  const fetchBookingSuccess = (booking) => {
    return {
      type: FETCH_BOOKING_SUCCESS,
      payload: booking,
    };
  };
  
  const fetchBookingFailure = (error) => {
    return {
      type: FETCH_BOOKING_FAILURE,
      payload: error,
    };
  };
  
  