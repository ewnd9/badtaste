import _ from 'lodash';
import storage, { OPEN_VK, SEARCH_VK, OPEN_FS, OPEN_GM_ALBUM } from './../storage';
import { prompt, urlPrompt, vkSearchPrompt } from './../prompts/vk-prompts';

import TracklistPrompt from './../tui/tracklist-prompt';
import FileManager from './../tui/file-manager';
import SelectList from './../tui/select-list';
import Toast from './../tui/toast';

import * as gmActions from './../actions/gm-actions';
import * as vkActions from './../actions/vk-actions';

let screen = null;
let leftPane = null;

export default (_screen, _leftPane) => {
  screen = _screen;
  leftPane = _leftPane;
  leftPane.on('select', selectLeftPane);

  renderLeftPane();
  selectLeftPane(null, 0);
};

let emitVkAudio = (payload) => storage.emit(OPEN_VK, payload);

let searchFn = () => vkSearchPrompt(screen).then((query) => emitVkAudio({ type: 'search', query: query }));
storage.on(SEARCH_VK, searchFn);

let selectLeftPane = (item, index) => {
  leftMenu[index].fn();
};

let leftMenu = [];

let nameWithCount = (name, xs) => name + (xs.length > 0 ? ` (${xs.length})` : '');
let selectOrSearch = (labels, onLabel, onSearch) => {
  SelectList(screen, ['> Search'].concat(labels)).then((index) => {
    if (index === 0) {
      onSearch();
    } else {
      onLabel(index - 1);
    }
  });
};

let vkMenu = () => {
  if (!storage.vkHasData()) {
    return [];
  }

  let vkLinks = storage.data.vkLinks;

  return [{
    name: '{bold}VK{/bold} Profile',
    fn: () => emitVkAudio({ type: 'profile' })
  },
  {
    name: '{bold}VK{/bold} Search',
    fn: searchFn
  },
  {
    name: '{bold}VK{/bold} Batch search',
    fn: () => TracklistPrompt(screen).then((text) => {
      emitVkAudio({ type: 'tracklist', tracklist: text });
    })
  },
  {
    name: nameWithCount('{bold}VK{/bold} Play link', vkLinks),
    fn: () => {
      let labels = vkLinks.map(link => link.name);
      selectOrSearch(labels, (i) => emitVkAudio(vkLinks[i].data), () => {
        urlPrompt(screen, 'Enter url', 'Enter alias for menu').then((promptResult) => {
          vkActions.detectUrlType(promptResult.url).then((data) => {
            if (data) {
              storage.data.vkLinks.unshift({
                data,
                name: promptResult.name
              });
              storage.save();

              renderLeftPane();

              leftPane.focus();
              screen.render();

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

let gmMenu = () => {
  if (!storage.gmHasData()) {
    return [];
  }
  
  let gmLinks = storage.data.gmLinks;

  return [{
    name: nameWithCount('{bold}GM{/bold} Play album', gmLinks),
    fn: () => {
      let labels = gmLinks.map(link => link.name);
      selectOrSearch(labels, (i) => storage.emit(OPEN_GM_ALBUM, gmLinks[i].data), () => {
        prompt(screen, 'Google Music', 'Search').then((query) => {
          gmActions.findAlbum(query).then((result) => {
            let labels = result.map((entry) => `${entry.album.artist} - ${entry.album.name}`);
            SelectList(screen, labels).then((index) => {
              let payload = { albumId: result[index].album.albumId };

              storage.data.gmLinks.unshift({
                data: payload,
                name: labels[index]
              });
              storage.save();

              renderLeftPane();

              leftPane.focus();
              screen.render();

              storage.emit(OPEN_GM_ALBUM, payload);
            });
          });
        });
      });
    }
  }];
};

let renderLeftPane = () => {
  let leftMenuRaw = vkMenu().concat(gmMenu()).concat([
    {
      name: nameWithCount('{bold}FS{/bold} Play folder', storage.data.fs),
      fn: () => {
        selectOrSearch(storage.data.fs, (i) => storage.emit(OPEN_FS, { path: storage.data.fs[i] }), () => {
          FileManager(screen).then((path) => {
            storage.data.fs.unshift(path);
            storage.save();

            renderLeftPane();
            leftPane.focus();

            storage.emit(OPEN_FS, { path: path });
          });
        });
      }
    }
  ]);

  leftMenu = _.flatten(leftMenuRaw);
  leftPane.setItems(_.pluck(leftMenu, 'name'));
};
