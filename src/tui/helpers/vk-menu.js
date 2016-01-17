import { urlPrompt, vkSearchPrompt } from './../../prompts/vk-prompts';
import { nameWithCount, selectOrSearch } from './menu';
import * as vkActions from './../../actions/vk-actions';

import TracklistPrompt from './../tracklist-prompt';
import SelectList from './../select-list';
import Toast from './../toast';

import storage, { OPEN_VK, SEARCH_VK, RENDER_LEFT_PANE } from './../../storage';

const emitVkAudio = (payload) => storage.emit(OPEN_VK, payload);

let _screen; // @TODO :(

const searchFn = () => vkSearchPrompt(_screen).then((query) => emitVkAudio({ type: 'search', query: query }));
storage.on(SEARCH_VK, searchFn);

export default (screen, leftPane) => {
	if (!storage.vkHasData()) {
    return [];
  }

	_screen = screen;
  const vkLinks = storage.data.vkLinks;

  return [{
    name: '{bold}VK{/bold} Profile',
    fn: () => emitVkAudio({ type: 'profile' })
  },
  {
    name: '{bold}VK{/bold} Recommendations',
    fn: () => emitVkAudio({ type: 'recommendations' })
  },
  {
    name: '{bold}VK{/bold} Playlists',
    fn: () => {
      vkActions.getAlbums().then((albums) => {
        Logger.info(albums);
        return SelectList(screen, albums.map((album) => album.title)).then((index) => {
          const album = albums[index];
          return emitVkAudio({ type: 'audio', owner_id: album.owner_id, album_id: album.album_id });
        });
      }).catch((err) => Logger.error(err));
    }
  },
  {
    name: '{bold}VK{/bold} Search',
    fn: searchFn
  },
  {
    name: '{bold}VK{/bold} Tracklist search',
    fn: () => TracklistPrompt(screen).then((text) => {
      emitVkAudio({ type: 'tracklist', tracklist: text });
    })
  },
  {
    name: nameWithCount('{bold}VK{/bold} Play link', vkLinks),
    fn: () => {
      const labels = vkLinks.map(link => link.name);
      selectOrSearch(screen, labels, (i) => emitVkAudio(vkLinks[i].data), () => {
        const urlsExamples = [
          'Enter url like:',
          '',
          'vk.com/audios1?album_id=1',
          'vk.com/wall1',
          'vk.com/user1'
        ];

        urlPrompt(screen, urlsExamples, 'Enter alias for menu').then((promptResult) => {
          vkActions.detectUrlType(promptResult.url).then((data) => {
            if (data) {
              storage.data.vkLinks.unshift({
                data,
                name: promptResult.name
              });
              storage.save();

							storage.emit(RENDER_LEFT_PANE);
              emitVkAudio(data);
            } else {
              Toast(screen, 'Error');
            }
          });
        });
      });
    }
  }];
};
