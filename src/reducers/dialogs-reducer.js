import {
  GM_FETCH_ALBUMS_RESPONSE,
  GM_DISMISS_ALBUMS
} from '../actions/gm-actions';

import {
  DIALOG_WITH_SPINNER_START,
  DIALOG_WITH_SPINNER_END,
  DIALOG_WITH_SPINNER_ERROR,
  GM_ALBUMS_DIALOG,
  STATE_OPEN_DIALOG,
  STATE_CLOSE_DIALOG,
  STATE_START_SPINNER,
  STATE_STOP_SPINNER
} from '../actions/dialogs-actions';

function dialogs(state = {
  gmAlbums: null,
  activeDialog: null,
  hasSpinner: false,
  activeState: null,
  message: null,
  endMessage: null
}, action) {
  switch (action.type) {
    case GM_FETCH_ALBUMS_RESPONSE:
      return {
        ...state,
        gmAlbums: action.albums,
        activeDialog: GM_ALBUMS_DIALOG,
        activeState: STATE_OPEN_DIALOG
      };
    case GM_DISMISS_ALBUMS:
      return {
        ...state,
        gmAlbums: null,
        activeDialog: null,
        activeState: STATE_CLOSE_DIALOG
      };
    case DIALOG_WITH_SPINNER_START:
      return {
        ...state,
        activeDialog: action.subType,
        activeState: STATE_START_SPINNER,
        message: action.message
      };
    case DIALOG_WITH_SPINNER_END:
      return {
        ...state,
        activeDialog: null,
        activeState: STATE_STOP_SPINNER,
        endMessage: action.endMessage
      };
    case DIALOG_WITH_SPINNER_ERROR:
      return {
        ...state,
        activeDialog: null,
        activeState: STATE_STOP_SPINNER,
        error: action.error
      };
    default:
      return state;
  }
}

export default dialogs;
