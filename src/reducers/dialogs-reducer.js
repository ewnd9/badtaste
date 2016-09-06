import { createReducer } from './utils';

import {
  DIALOG_WITH_SPINNER_START,
  DIALOG_WITH_SPINNER_END,
  DIALOG_WITH_SPINNER_ERROR,
  STATE_START_SPINNER,
  STATE_STOP_SPINNER
} from '../actions/dialogs-actions';

export default createReducer({
  activeDialog: null,
  hasSpinner: false,
  activeState: null,
  message: null,
  endMessage: null
}, {
  [DIALOG_WITH_SPINNER_START](state, action) {
    return {
      ...state,
      activeDialog: action.subType,
      activeState: STATE_START_SPINNER,
      message: action.message
    };
  },
  [DIALOG_WITH_SPINNER_END](state, action) {
    return {
      ...state,
      activeDialog: null,
      activeState: STATE_STOP_SPINNER,
      endMessage: action.endMessage
    };
  },
  [DIALOG_WITH_SPINNER_ERROR](state, action) {
    return {
      ...state,
      activeDialog: null,
      activeState: STATE_STOP_SPINNER,
      error: action.error
    };
  }
});
