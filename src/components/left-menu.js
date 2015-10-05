import path from 'path';

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

let renderLeftPane = () => {
  let leftMenuRaw = [
    {
      name: '{bold}VK{/bold} Profile',
      fn: () => emitVkAudio({ type: 'profile' })
    },
    {
      name: '{bold}VK{/bold} Search',
      fn: searchFn
    },
    storage.data.vkLinks.map((link) => {
      return {
        name: `{bold}VK{/bold} ${link.name}`,
        fn: () => emitVkAudio(link.data)
      };
    }),
    {
      name: '{bold}VK{/bold} Add link',
      fn: () => urlPrompt(screen).then((promptResult) => {
        vkActions.detectUrlType(promptResult.url).then((data) => {
          if (data) {
            storage.data.vkLinks.push({
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
      })
    },
    {
      name: '{bold}VK{/bold} Add playlist',
      fn: () => TracklistPrompt(screen).then((text) => {
        emitVkAudio({ type: 'tracklist', tracklist: text });
      })
    },
    {
      name: '{bold}GM{/bold} Search',
      fn: () => prompt(screen, 'Google Music', 'Search').then((query) => {
        gmActions.findAlbum(query).then((result) => {
          let labels = result.map((entry) => `${entry.album.artist} - ${entry.album.name}`);
          SelectList(screen, labels).then((index) => {
            storage.emit(OPEN_GM_ALBUM, { albumId: result[index].album.albumId });
          });
        });
      })
    },
    storage.data.fs.map((dir) => {
      return {
        name: `{bold}FS{/bold} ${path.basename(dir)}`,
        fn: () => storage.emit(OPEN_FS, { path: dir })
      };
    }),
    {
      name: '{bold}FS{/bold} Add folder',
      fn: () => {
        FileManager(screen).then((path) => {
          storage.data.fs.push(path);
          storage.save();

          renderLeftPane();
          leftPane.focus();

          storage.emit(OPEN_FS, { path: path });
        });
      }
    }
  ];

  leftMenu = _.flatten(leftMenuRaw);
  leftPane.setItems(_.pluck(leftMenu, 'name'));
};
