import {
  VK_SEARCH_MODAL,
  VK_LINKS_MODAL,
  VK_NEW_LINK_MODAL,
  VK_USER_PLAYLISTS_MODAL,
  RESET_MODALS
} from '../actions/modals-actions';

function modalsReducer(state = {
  modal: null,
  props: null
}, action) {
  switch (action.type) {
    case VK_SEARCH_MODAL:
      return replaceState(state, VK_SEARCH_MODAL);
    case VK_LINKS_MODAL:
      return replaceState(state, VK_LINKS_MODAL);
    case VK_NEW_LINK_MODAL:
      return replaceState(state, VK_NEW_LINK_MODAL);
    case VK_USER_PLAYLISTS_MODAL:
      return replaceState(state, VK_USER_PLAYLISTS_MODAL, action.props);
    case RESET_MODALS:
      return {
        ...state,
        modal: null
      };
    default:
      return state;
  }
}

export default modalsReducer;

function replaceState(state, nextModal, nextProps) {
  return {
    ...state,
    modal: nextModal,
    props: nextProps
  };
}
