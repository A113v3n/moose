import {
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE,
} from '../actions/types';

const initialState = {
  profile: null,
  profiles: [],
  loading: true,
  error: {},
};

function profileReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false,
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
export default profileReducer;
