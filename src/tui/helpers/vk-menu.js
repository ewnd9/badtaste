import { urlPrompt, vkSearchPrompt } from './../vk-prompts';
import { nameWithCount, selectOrSearch } from './menu';

import {
  fetchProfileAudio,
  fetchSearchAudio,
  fetchRecommendationsAudio,
  fetchAlbums,
  fetchGroupAudio,
  fetchGroupWall,
  fetchWallAudio,
  fetchTracklist,
  fetchAudioByUrl
} from '../../actions/vk-actions';

import TracklistPrompt from '../tracklist-prompt';

import storage, {
  SEARCH_VK,
  RENDER_LEFT_PANE,
  store
} from '../../storage';

export default VkMenu;

function VkMenu(screen) {
  if (!storage.vkHasData()) {
    return [];
  }

  storage.on(SEARCH_VK, searchFn);

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
    fn: () => store.dispatch(fetchAlbums())
  },
  {
    name: '{bold}VK{/bold} Search',
    fn: searchFn
  },
  {
    name: '{bold}VK{/bold} Tracklist search',
    fn: () => TracklistPrompt(screen).then(text => store.dispatch(fetchTracklist(text)))
  },
  {
    name: nameWithCount('{bold}VK{/bold} Play link', vkLinks),
    fn: playLinkFn
  }];

  function playLinkFn() {
    const labels = vkLinks.map(link => link.name);

    const onSelectExisting = i => {
      const data = vkLinks[i].data;

      if (data.url) {
        store.dispatch(fetchAudioByUrl(data.url));
      } else if (data.type === 'audio') {
        store.dispatch(fetchGroupAudio(data.owner_id, data.album_id));
      } else if (data.type === 'wall') {
        store.dispatch(fetchWallAudio(data.id));
      } else if (data.type === 'full-wall') {
        store.dispatch(fetchGroupWall(data.id));
      }
    };

    const onSearchNew = () => {
      const urlsExamples = [
        'Enter url like:',
        '',
        'vk.com/audios1?album_id=1',
        'vk.com/wall1',
        'vk.com/user1'
      ];

      urlPrompt(screen, urlsExamples, 'Enter alias for menu')
        .then(promptResult => {
          storage.data.vkLinks.unshift({ // insert at the beginning
            name: promptResult.name,
            data: { url: promptResult.url }
          });

          storage.emit(RENDER_LEFT_PANE);
          store.dispatch(fetchAudioByUrl(promptResult.data.url));
        });
    };

    selectOrSearch(screen, labels, onSelectExisting, onSearchNew);
  }

  function searchFn() {
    return vkSearchPrompt(screen)
      .then(query => fetchSearchAudio(query));
  }
}
