import {
  DIALOG_WITH_SPINNER_START,
  DIALOG_WITH_SPINNER_END,
  DIALOG_WITH_SPINNER_ERROR,
  STATE_START_SPINNER,
  STATE_STOP_SPINNER
} from '../actions/dialogs-actions';

function dialogs(state = {
  activeDialog: null,
  hasSpinner: false,
  activeState: null,
  message: null,
  endMessage: null
}, action) {
  switch (action.type) {
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
