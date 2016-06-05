import { nameWithCount } from './menu';

import {
  fetchProfileAudio,
  fetchRecommendationsAudio,
  fetchTracklist
} from '../../actions/vk-actions';

import {
  openVkSearchModal,
  openVkLinksModal,
  openVkUserPlaylistsModal
} from '../../actions/modals-actions';

import TracklistPrompt from '../tracklist-prompt';

import storage, {
  SEARCH_VK,
  store
} from '../../storage';

export default VkMenu;

function VkMenu(screen) {
  if (!storage.vkHasData()) {
    return [];
  }

  const openSearchModal = () => store.dispatch(openVkSearchModal());
  storage.on(SEARCH_VK, openSearchModal);

  const { vkLinks } = storage.data;

  return [{
    name: '{bold}VK{/bold} Profile',
    fn: () => store.dispatch(fetchProfileAudio())
  },
  {
    name: '{bold}VK{/bold} Recommendations',
    fn: () => store.dispatch(fetchRecommendationsAudio())
  },
  {
    name: '{bold}VK{/bold} Playlists',
    fn: () => store.dispatch(openVkUserPlaylistsModal())
  },
  {
    name: '{bold}VK{/bold} Search',
    fn: openSearchModal
  },
  {
    name: '{bold}VK{/bold} Tracklist search',
    fn: () => TracklistPrompt(screen).then(text => store.dispatch(fetchTracklist(text)))
  },
  {
    name: nameWithCount('{bold}VK{/bold} Play link', vkLinks),
    fn: () => store.dispatch(openVkLinksModal())
  }];
}
