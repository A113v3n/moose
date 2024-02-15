import {
  FETCH_LOCATIONS_REQUEST,
  FETCH_LOCATIONS_SUCCESS,
  FETCH_LOCATIONS_FAILURE,
  FETCH_TIME_SLOTS_REQUEST,
  FETCH_TIME_SLOTS_SUCCESS,
  FETCH_TIME_SLOTS_FAILURE,
  CREATE_BOOKING_SUCCESS,
  CREATE_BOOKING_REQUEST,
  CREATE_BOOKING_FAILURE,
  SET_SELECTED_LOCATION,
  SET_SELECTED_DURATION,
  SET_SELECTED_DATE,
  FETCH_TIME_SLOTS,
  FETCH_THERAPISTS_REQUEST,
  FETCH_THERAPISTS_SUCCESS,
  FETCH_THERAPISTS_FAILURE
} from '../actions/types';
  
  const initialState = {
    locations: [],
    therapists: [],
    selectedLocation: null,
    selectedDuration: null,
    selectedDate: null,
    timeSlots: [],
    booking: null,
    loading: false,
    error: null,
  };
  
  const bookingReducer = (state = initialState, action) => {

    switch (action.type) {
      case FETCH_LOCATIONS_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case FETCH_LOCATIONS_SUCCESS:
        return {
          ...state,
          loading: false,
          locations: action.payload, // Update locations instead of appointment
          error: null,
        };
      case FETCH_LOCATIONS_FAILURE:
        return {
          ...state,
          loading: false,
          locations: [],
          error: action.payload,
        };
        case SET_SELECTED_LOCATION:
          return {
            ...state,
            selectedLocation: action.payload,
          };
    
        case SET_SELECTED_DURATION:
          return {
            ...state,
            selectedDuration: action.payload,
          };
    
        case SET_SELECTED_DATE:
          return {
            ...state,
            selectedDate: action.payload,
          };
    
        case FETCH_TIME_SLOTS:
          return {
            ...state,
            timeSlots: action.payload,
          };
          case FETCH_THERAPISTS_REQUEST:
            return {
              ...state,
              loading: true,
            };
            case FETCH_THERAPISTS_SUCCESS:

              return {
                ...state,
                loading: false,
                therapists: action.payload,
                error: null,
              };
          case FETCH_THERAPISTS_FAILURE:
            return {
              ...state,
              loading: false,
              therapists: [],
              error: action.payload,
            };
            // Add these cases in your bookingReducer
            case CREATE_BOOKING_REQUEST:
              return {
                ...state,
                loading: true,
              };
              case CREATE_BOOKING_SUCCESS:

                return {
                  ...state,
                  loading: false,
                  booking: action.payload.booking,  
                  bookingId: action.payload.bookingId,  // Add this line
                  error: null,
                };
            case CREATE_BOOKING_FAILURE:
              return {
                ...state,
                loading: false,
                booking: null,
                error: action.payload,
              };
          case FETCH_TIME_SLOTS_REQUEST:
            return {
              ...state,
              loading: true,
            };
          case FETCH_TIME_SLOTS_SUCCESS:
            return {
              ...state,
              loading: false,
              timeSlots: action.payload.slots,
              error: null,
            };
          case FETCH_TIME_SLOTS_FAILURE:
            return {
              ...state,
              loading: false,
              timeSlots: [],
              error: action.payload,
            };

          default:
            return state;
        }
      };
  
  export default bookingReducer;
  