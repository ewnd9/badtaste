export const VK_SEARCH_MODAL = 'VK_SEARCH_MODAL';
export const VK_LINKS_MODAL = 'VK_LINKS_MODAL';
export const VK_NEW_LINK_MODAL = 'VK_NEW_LINK_MODAL';
export const VK_USER_PLAYLISTS_MODAL = 'VK_USER_PLAYLISTS_MODAL';

export const GM_LINKS_MODAL = 'GM_LINKS_MODAL';
export const GM_ALBUMS_SEARCH_RESULT_MODAL= 'GM_ALBUMS_SEARCH_RESULT_MODAL';

export const RESET_MODALS = 'RESET_MODALS';

import * as vkApi from '../api/vk-api';
import * as gmApi from '../api/gm-api';

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

    return vkApi.getAlbums()
      .then(albums => {
        dispatch({ type: VK_USER_PLAYLISTS_MODAL, props: { albums } });
      })
      .catch(error => {
        dispatch(apiError(VK_USER_PLAYLISTS_MODAL, error));
      });
  };
}

export function openGmLinksModal() {
  return {
    type: GM_LINKS_MODAL
  };
}

export function openGmAlbumsSearchResultModal(query) {
  return dispatch => {
    dispatch(apiRequest(GM_ALBUMS_SEARCH_RESULT_MODAL));

    return gmApi.getAlbums(query)
      .then(albums => {
        dispatch({ type: GM_ALBUMS_SEARCH_RESULT_MODAL, props: { albums } });
      })
      .catch(error => {
        dispatch(apiError(GM_ALBUMS_SEARCH_RESULT_MODAL, error));
      });
  };
}

export function resetModals() {
  return {
    type: RESET_MODALS
  };
}
