export const FS_FETCH_PATH = 'FS_FETCH_ALBUM';

import {
  fetch
} from './api-actions';

import {
  getFolder,
  getTags,
  flattenCollection
} from '../api/fs-api';

export function fetchPath(path) {
  return fetch(FS_FETCH_PATH, () => {
    const folder = getFolder(path);

    return getTags(folder)
      .then(result => {
        return flattenCollection(result);
      });
  });
}
