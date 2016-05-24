import {
  getProfileAudio,
  getGroupAudio,
  getWallAudio,
  getSearch,
  getRecommendations,
  getAlbums,
  getBatchSearch,
  resolveScreenName
} from '../api/vk-api';

import {
  apiRequest,
  apiResponseAddTrack,
  apiResponseComplete,
  apiError,
  fetch
} from './api-actions';

export const VK_FETCH_PROFILE_AUDIO = 'VK_FETCH_PROFILE_AUDIO';
export const VK_FETCH_GROUP_AUDIO = 'VK_FETCH_GROUP_AUDIO';
export const VK_FETCH_WALL_AUDIO = 'VK_FETCH_WALL_AUDIO';
export const VK_FETCH_SEARCH_AUDIO = 'VK_FETCH_SEARCH_AUDIO';
export const VK_FETCH_RECOMMENDATIONS_AUDIO = 'VK_FETCH_RECOMMENDATIONS_AUDIO';

export const VK_FETCH_ALBUMS_REQUEST = 'VK_FETCH_ALBUMS_REQUEST';
export const VK_FETCH_ALBUMS_RESPONSE = 'VK_FETCH_ALBUMS_RESPONSE';
export const VK_DISMISS_ALBUMS = 'VK_DISMISS_ALBUMS';

export const VK_RESOLVE_SCREEN_NAME_REQUEST = 'VK_RESOLVE_SCREEN_NAME_REQUEST';
export const VK_RESOLVE_SCREEN_NAME_RESPONSE = 'VK_RESOLVE_SCREEN_NAME_RESPONSE';

export const VK_FETCH_TRACKLIST_REQUEST = 'VK_FETCH_TRACKLIST_REQUEST';
export const VK_FETCH_TRACKLIST_RESPONSE = 'VK_FETCH_TRACKLIST_RESPONSE';

export function fetchProfileAudio() {
  return fetch(VK_FETCH_PROFILE_AUDIO, () => getProfileAudio());
}

export function fetchGroupAudio(groupId, albumId) {
  return fetch(VK_FETCH_GROUP_AUDIO, () => getGroupAudio(groupId, albumId));
}

export function fetchWallAudio(id) {
  return fetch(VK_FETCH_WALL_AUDIO, () => getWallAudio(id));
}

export function fetchSearchAudio(query) {
  return fetch(VK_FETCH_SEARCH_AUDIO, () => getSearch(query));
}

export function fetchRecommendationsAudio() {
  return fetch(VK_FETCH_RECOMMENDATIONS_AUDIO, () => getRecommendations());
}

export function fetchAlbums() {
  return dispatch => {
    dispatch(apiRequest(VK_FETCH_ALBUMS_REQUEST));

    return getAlbums()
      .then(albums => dispatch({ type: VK_FETCH_ALBUMS_RESPONSE, albums }))
      .catch(error => dispatch(apiError(VK_FETCH_ALBUMS_REQUEST, error)));
  };
}

export function dismissAlbums() {
  return {
    type: VK_DISMISS_ALBUMS
  };
}

const albumRegex = /.*vk.com\/audios([-\d]+)\?album_id=([\d]+)/;
const wallRegex = /.*vk.com\/wall([\S]+)/;
const communityRegex = /.*vk.com\/([\S]+)/;

export function fetchAudioByUrl(url) {
  const albumMatch = albumRegex.exec(url);

  if (albumMatch) {
    return fetchGroupAudio(albumMatch[1], albumMatch[2]);
  }

  const wallMatch = wallRegex.exec(url);

  if (wallMatch) {
    return fetchWallAudio(wallMatch[1]);
  }

  const communityMatch = communityRegex.exec(url);

  if (communityMatch) {
    const screenName = communityMatch[1];

    return dispatch => {
      dispatch({ type: VK_RESOLVE_SCREEN_NAME_REQUEST, screenName });

      return resolveScreenName(screenName)
        .then(response => {
          dispatch({ type: VK_RESOLVE_SCREEN_NAME_RESPONSE, screenName });
          dispatch(fetchWallAudio((response.type === 'group' ? '-' : '') + response.object_id));
        })
        .catch(err => dispatch(apiError(VK_RESOLVE_SCREEN_NAME_REQUEST, err)));
    };
  }

  return { type: 'error' };
}

export function fetchTracklist(tracklist) {
  return dispatch => {
    dispatch(apiRequest(VK_FETCH_TRACKLIST_REQUEST));

    const onTrack = createOnTrackListener(VK_FETCH_TRACKLIST_REQUEST, dispatch);

    return getBatchSearch(tracklist, onTrack)
      .then(() => dispatch(apiResponseComplete(VK_FETCH_TRACKLIST_RESPONSE)))
      .catch(err => dispatch(apiError(VK_FETCH_TRACKLIST_REQUEST, err)));
  };
}

function createOnTrackListener(subType, dispatch) {
  // return (track, index, length) => {
  return track => {
    dispatch(apiResponseAddTrack(subType, track));
    // spinner.setContent(`${index + 1} / ${length}. press z to cancel`);
  };
}
