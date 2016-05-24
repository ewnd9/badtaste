export const SET_CURRENT_INDEX = 'SET_CURRENT_INDEX';
export const MOVE_NEXT = 'MOVE_NEXT';
export const FILTER_PLAYLIST = 'FILTER_PLAYLIST';

export function setCurrentIndex(index) {
  return {
    type: SET_CURRENT_INDEX,
    index
  };
}

export function moveNext() {
  return {
    type: MOVE_NEXT
  };
}

export function filterPlaylist(query) {
  return {
    type: FILTER_PLAYLIST,
    query
  };
}
