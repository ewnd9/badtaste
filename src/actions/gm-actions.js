export const GM_FETCH_ALBUM = 'GM_FETCH_ALBUM';
export const GM_FETCH_THUMBS_UP = 'GM_FETCH_THUMBS_UP';
export const GM_FETCH_ALL_TRACK = 'GM_FETCH_ALL_TRACK';

export const GM_FETCH_ALBUMS_REQUEST = 'GM_FETCH_ALBUMS_REQUEST';
export const GM_FETCH_ALBUMS_RESPONSE = 'GM_FETCH_ALBUMS_RESPONSE';

export const GM_DISMISS_ALBUMS = 'GM_DISMISS_ALBUMS';

import {
  fetch,
  apiRequest,
  apiError
} from './api-actions';

import {
  getAlbum,
  getThumbsUp,
  getAllTracks,
  getAlbums
} from '../api/gm-api';

export function fetchAlbum(albumId) {
  return fetch(GM_FETCH_ALBUM, () => getAlbum(albumId));
}

export function fetchThumbsUp() {
  return fetch(GM_FETCH_THUMBS_UP, () => getThumbsUp());
}

export function fetchAllTracks() {
  return fetch(GM_FETCH_ALL_TRACK, () => getAllTracks());
}

export function fetchAlbums() {
  return dispatch => {
    dispatch(apiRequest(GM_FETCH_ALBUMS_REQUEST));

    return getAlbums()
      .then(albums => dispatch({ type: GM_FETCH_ALBUMS_RESPONSE, albums }))
      .catch(error => dispatch(apiError(GM_FETCH_ALBUMS_REQUEST, error)));
  };
}

export function dismissAlbums() {
  return {
    type: GM_DISMISS_ALBUMS
  };
}
