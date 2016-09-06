import { createReducer } from './utils';

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

import storage, {
  PLAY
} from '../storage';

const defaultState = {
  originalPlaylist: [],
  playlist: [],
  currentIndex: 0,
  isFetching: false,
  error: null
};

export default createReducer(defaultState, {
  [SET_CURRENT_INDEX](state, action) {
    let currentIndex;

    currentIndex = action.index % state.playlist.length;
    currentIndex = findNext(state.playlist, currentIndex, action); // @sideEffect

    return {
      ...state,
      currentIndex
    };
  },
  [MOVE_NEXT](state, action) {
    let currentIndex;

    currentIndex = (state.currentIndex + 1) % state.playlist.length;
    currentIndex = findNext(state.playlist, currentIndex, action); // @sideEffect

    return {
      ...state,
      currentIndex
    };
  },
  [FILTER_PLAYLIST](state, action) {
    const { originalPlaylist } = this.state;
    const { query } = action;

    let playlist;
    let currentIndex;

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
  },
  [API_REQUEST](state) {
    return {
      ...state,
      isFetching: true
    };
  },
  [API_RESPONSE](state, action) {
    let currentIndex = 0;
    const playlist = action.audio;

    currentIndex = findNext(playlist, currentIndex, action); // @sideEffect

    return {
      ...state,
      isFetching: false,
      playlist,
      originalPlaylist: playlist,
      currentIndex
    };
  },
  [API_RESPONSE_ADD_TRACK](state, action) {
    const playlist = state.playlist.concat(action.track);

    return {
      ...state,
      isFetching: false,
      playlist,
      originalPlaylist: playlist
    };
  },
  [API_RESPONSE_COMPLETE](state) {
    return {
      ...state,
      isFetching: false
    };
  },
  [API_ERROR](state, action) {
    Logger.error(action.error);

    return {
      ...state,
      isFetching: false,
      error: action.error
    };
  }
});

// function findNext(playlist, initialIndex, action) { // @TODO redux-side-effect with action
function findNext(playlist, initialIndex) {
  let index = initialIndex;

  for (let i = 0 ; i < playlist.length ; i++) {
    const url = playlist[index].url;

    if (url) {
      (typeof url === 'function' ? url() : Promise.resolve(url))
        .then(url => {
          storage.emit(PLAY, url);
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
