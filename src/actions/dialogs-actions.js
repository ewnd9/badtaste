import {
  addToProfile,
  addOnTop
} from '../api/vk-api';

import storage, {
  UPDATE_RIGHT_PANE_ITEM,
  FOCUS_RIGHT_PANE
} from '../storage';

export const VK_ADD_TO_PROFILE_DIALOG = 'VK_ADD_TO_PROFILE_DIALOG';
export const VK_ADD_ON_TOP_DIALOG = 'VK_ADD_ON_TOP_DIALOG';

export const DIALOG_WITH_SPINNER_START = 'DIALOG_WITH_SPINNER_START';
export const DIALOG_WITH_SPINNER_END = 'DIALOG_WITH_SPINNER_END';
export const DIALOG_WITH_SPINNER_ERROR = 'DIALOG_WITH_SPINNER_ERROR';

export const STATE_START_SPINNER = 'STATE_START_SPINNER';
export const STATE_STOP_SPINNER = 'STATE_STOP_SPINNER';

export function vkAddToProfile(selected, listEl) {
  const subType = VK_ADD_TO_PROFILE_DIALOG;
  const message = 'Adding...';
  const endMessage = 'Successfully added to your profile';

  const apiCall = () => addToProfile(selected)
    .then(() => {
      storage.emit(UPDATE_RIGHT_PANE_ITEM, { item: listEl, text: selected.trackTitleFull });
      storage.emit(FOCUS_RIGHT_PANE);
    });

  return dialogWithSpinner(subType, message, endMessage, apiCall);
}

export function vkAddOnTop(selected) {
  const subType = VK_ADD_ON_TOP_DIALOG;
  const message = 'Moving...';
  const endMessage = 'Successfully added to your profile';
  const apiCall = () => addOnTop(selected);

  return dialogWithSpinner(subType, message, endMessage, apiCall);
}

function dialogWithSpinner(subType, message, endMessage, apiCall) {
  return dispatch => {
    dispatch({ type: DIALOG_WITH_SPINNER_START, subType, message });

    return apiCall()
      .then(() => dispatch({ type: DIALOG_WITH_SPINNER_END, subType, endMessage }))
      .catch(err => dispatch({ type: DIALOG_WITH_SPINNER_ERROR, subType, err }));
  };
}
