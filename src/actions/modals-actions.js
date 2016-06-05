export const VK_SEARCH_MODAL = 'VK_SEARCH_MODAL';
export const VK_LINKS_MODAL = 'VK_LINKS_MODAL';
export const VK_NEW_LINK_MODAL = 'VK_NEW_LINK_MODAL';
export const VK_USER_PLAYLISTS_MODAL = 'VK_USER_PLAYLISTS_MODAL';

export const RESET_MODALS = 'RESET_MODALS';

import {
  getAlbums
} from '../api/vk-api';

import {
  apiRequest,
  apiError
} from './api-actions';

export function openVkSearchModal() {
  return {
    type: VK_SEARCH_MODAL
  };
}

export function openVkLinksModal() {
  return {
    type: VK_LINKS_MODAL
  };
}

export function openVkNewLinkModal() {
  return {
    type: VK_NEW_LINK_MODAL
  };
}

export function openVkUserPlaylistsModal() {
  return dispatch => {
    dispatch(apiRequest(VK_USER_PLAYLISTS_MODAL));

    return getAlbums()
      .then(albums => {
        dispatch({ type: VK_USER_PLAYLISTS_MODAL, props: { albums } });
      })
      .catch(error => {
        dispatch(apiError(VK_USER_PLAYLISTS_MODAL, error));
      });
  };
}

export function resetModals() {
  return {
    type: RESET_MODALS
  };
}
