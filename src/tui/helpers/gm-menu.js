import { nameWithCount } from './menu';

import storage, {
  store
} from '../../storage';

import {
  fetchThumbsUp,
  fetchAllTracks,
} from '../../actions/gm-actions';

import {
  openGmLinksModal
} from '../../actions/modals-actions';

import { isAllAccess } from '../../api/gm-api';

export default (screen, gmLinks) => {
  if (!storage.gmHasData()) {
    return [];
  }

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

  // if (isAllAccess()) {
    result.push({
      name: nameWithCount('{bold}GM{/bold} Play album', gmLinks),
      fn: () => store.dispatch(openGmLinksModal())
    });
  // }

  return result;
};
