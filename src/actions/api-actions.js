export const API_REQUEST = 'API_REQUEST';
export const API_RESPONSE = 'API_RESPONSE';
export const API_RESPONSE_ADD_TRACK = 'API_RESPONSE_ADD_TRACK';
export const API_RESPONSE_COMPLETE = 'API_RESPONSE_COMPLETE';
export const API_ERROR = 'API_ERROR';

export function apiRequest(subType) {
  return {
    type: API_REQUEST,
    subType
  };
}

export function apiResponse(subType, audio) {
  return {
    type: API_RESPONSE,
    subType,
    audio
  };
}

export function apiResponseAddTrack(subType, track) {
  return {
    type: API_RESPONSE_ADD_TRACK,
    subType,
    track
  };
}

export function apiResponseComplete(subType) {
  return {
    type: API_RESPONSE_COMPLETE,
    subType
  };
}

export function apiError(subType, error) {
  return {
    type: API_ERROR,
    subType,
    error
  };
}

export function fetch(subType, apiCall) {
  return dispatch => {
    dispatch(apiRequest(subType));

    return apiCall()
      .then(audio => dispatch(apiResponse(subType, audio)))
      .catch(err => dispatch(apiError(subType, err)));
  };
}
