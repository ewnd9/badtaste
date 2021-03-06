import {
  getProfileAudio,
  getGroupAudio,
  getWallAudio,
  getWall,
  getSearch,
  getRecommendations,
  getBatchSearch,
  getOwnerIdByUrl
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
export const VK_FETCH_GROUP_WALL = 'VK_FETCH_GROUP_WALL';
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

export function fetchGroupWall(ownerId) {
  return fetch(VK_FETCH_GROUP_WALL, () => getWall(ownerId));
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

const albumRegex = /.*vk.com\/audios([-\d]+)\?album_id=([\d]+)/;
const wallRegex = /.*vk.com\/wall([\S]+)/;

export function fetchAudioByUrl(url) {
  const albumMatch = albumRegex.exec(url);

  if (albumMatch) {
    return fetchGroupAudio(albumMatch[1], albumMatch[2]);
  }

  const wallMatch = wallRegex.exec(url);

  if (wallMatch) {
    return fetchWallAudio(wallMatch[1]);
  }

  return dispatch => {
    return getOwnerIdByUrl(url)
      .then(ownerId => {
        dispatch(fetchWallAudio(ownerId));
      })
      .catch(err => {
        Logger.error(err); // @TODO add to redux ecosystem
      });
  };
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
