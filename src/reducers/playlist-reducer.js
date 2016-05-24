import {
  SET_CURRENT_INDEX,
  MOVE_NEXT,
  FILTER_PLAYLIST
} from '../actions/playlist-actions';

import {
  API_REQUEST,
  API_RESPONSE,
  API_RESPONSE_ADD_TRACK,
  API_RESPONSE_COMPLETE,
  API_ERROR
} from '../actions/api-actions';

import {
  player
} from '../storage';

export default playlistReducer;

const defaultState = {
  originalPlaylist: [],
  playlist: [],
  currentIndex: 0,
  isFetching: false,
  error: null
};

function playlistReducer(state = defaultState, action) {
  Logger.info(action.type, action.subType);

  let currentIndex;
  let playlist;

  switch (action.type) {
    case SET_CURRENT_INDEX:
      currentIndex = action.index % state.playlist.length;
      currentIndex = findNext(state.playlist, currentIndex, action); // @sideEffect

      return {
        ...state,
        currentIndex
      };
    case MOVE_NEXT:
      currentIndex = (state.currentIndex + 1) % state.playlist.length;
      currentIndex = findNext(state.playlist, currentIndex, action); // @sideEffect

      return {
        ...state,
        currentIndex
      };
    case FILTER_PLAYLIST:
      const { originalPlaylist } = this.state;
      const { query } = action;

      if (!query || query.length === 0) {
        playlist = originalPlaylist;
      } else {
        const s = query.toLowerCase();

        playlist = originalPlaylist.filter(track => {
          return track.artist.toLowerCase().indexOf(s) > - 1 ||
                 track.title.toLowerCase().indexOf(s) > -1;
        });
      }

      return {
        ...state,
        currentIndex,
        playlist
      };
    case API_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case API_RESPONSE:
      currentIndex = 0;
      playlist = action.audio;

      currentIndex = findNext(playlist, currentIndex, action); // @sideEffect

      return {
        ...state,
        isFetching: false,
        playlist,
        originalPlaylist: playlist,
        currentIndex
      };
    case API_RESPONSE_ADD_TRACK:
      playlist = state.playlist.concat(action.track);

      return {
        ...state,
        isFetching: false,
        playlist,
        originalPlaylist: playlist
      };
    case API_RESPONSE_COMPLETE:
      return {
        ...state,
        isFetching: false
      };
    case API_ERROR:
      Logger.error(action.error);  // @sideEffect

      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}

// function findNext(playlist, initialIndex, action) { // @TODO redux-side-effect with action
function findNext(playlist, initialIndex) {
  let index = initialIndex;

  for (let i = 0 ; i < playlist.length ; i++) {
    const url = playlist[index].url;

    if (url) {
      (typeof url === 'function' ? url() : Promise.resolve(url))
        .then(url => {
          player.play(url);
        })
        .catch(err => {
          Logger.error(err);
        });
      break;
    } else {
      index++;
    }
  }

  return index;
}
