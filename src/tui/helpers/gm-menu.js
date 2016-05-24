import { nameWithCount, selectOrSearch } from './menu';

import storage, {
  store
} from '../../storage';

import {
  fetchAlbum,
  fetchAlbums,
  fetchThumbsUp,
  fetchAllTracks,
} from '../../actions/gm-actions';

import { isAllAccess } from '../../api/gm-api';

export default screen => {
  if (!storage.gmHasData()) {
    return [];
  }

  const { gmLinks } = storage.data;

  const result = [
    {
      name: '{bold}GM{/bold} Thumbs up',
      fn: () => store.dispatch(fetchThumbsUp())
    },
    {
      name: '{bold}GM{/bold} All Tracks',
      fn: () => store.dispatch(fetchAllTracks())
    }
  ];

  if (isAllAccess()) {
    result.push({
      name: nameWithCount('{bold}GM{/bold} Play album', gmLinks),
      fn: () => {
        const labels = gmLinks.map(link => link.name);
        const onSelectExisting = i => store.dispatch(fetchAlbum(gmLinks[i].data.albumId));

        const onSearchNew = () => {
          prompt(screen, 'Google Music', 'Search').then(query => store.dispatch(fetchAlbums(query)));
        };

        selectOrSearch(screen, labels, onSelectExisting, onSearchNew);
      }
    });
  }

  return result;
};
