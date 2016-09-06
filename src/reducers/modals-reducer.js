import { createReducer } from './utils';

import {
  VK_SEARCH_MODAL,
  VK_LINKS_MODAL,
  VK_NEW_LINK_MODAL,
  VK_NEW_WALL_MODAL,
  VK_USER_PLAYLISTS_MODAL,
  GM_LINKS_MODAL,
  GM_ALBUMS_SEARCH_RESULT_MODAL,
  RESET_MODALS
} from '../actions/modals-actions';

export default createReducer({
  modal: null,
  props: null
}, {
  [VK_SEARCH_MODAL](state) {
    return replaceState(state, VK_SEARCH_MODAL);
  },
  [VK_LINKS_MODAL](state) {
    return replaceState(state, VK_LINKS_MODAL);
  },
  [VK_NEW_LINK_MODAL](state) {
    return replaceState(state, VK_NEW_LINK_MODAL);
  },
  [VK_NEW_WALL_MODAL](state) {
    return replaceState(state, VK_NEW_WALL_MODAL);
  },
  [VK_SEARCH_MODAL](state) {
    return replaceState(state, VK_SEARCH_MODAL);
  },
  [VK_USER_PLAYLISTS_MODAL](state, action) {
    return replaceState(state, VK_USER_PLAYLISTS_MODAL, action.props);
  },
  [GM_LINKS_MODAL](state) {
    return replaceState(state, GM_LINKS_MODAL);
  },
  [GM_ALBUMS_SEARCH_RESULT_MODAL](state, action) {
    return replaceState(state, GM_ALBUMS_SEARCH_RESULT_MODAL, action.props);
  },
  [RESET_MODALS](state) {
    return {
      ...state,
      modal: null
    };
  }
});

function replaceState(state, nextModal, nextProps) {
  return {
    ...state,
    modal: nextModal,
    props: nextProps
  };
}
