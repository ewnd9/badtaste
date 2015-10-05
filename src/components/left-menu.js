import path from 'path';

import _ from 'lodash';
import storage, { OPEN_VK, SEARCH_VK, OPEN_FS, OPEN_GM_ALBUM } from './../storage';
import { prompt, urlPrompt, vkUrlPrompt, vkSearchPrompt } from './../prompts/vk-prompts';

import TracklistPrompt from './../tui/tracklist-prompt';
import FileManager from './../tui/file-manager';
import SelectList from './../tui/select-list';

import * as gmActions from './../actions/gm-actions';

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
    storage.data.groups.map((group) => {
      return {
        name: `{bold}VK{/bold} ${group.name}`,
        fn: () => emitVkAudio({ type: 'group', id: group.id })
      };
    }),
    {
      name: '{bold}VK{/bold} Add group',
      fn: () => vkUrlPrompt(screen).then((data) => {
        let { id, name } = data;

        storage.data.groups.push({
          id: id,
          name: name
        });
        storage.save();

        renderLeftPane();
        leftPane.focus();

        emitVkAudio({ type: 'group', id: id });
      })
    },
    storage.data.vkWall.map((group) => {
      return {
        name: `{bold}VK{/bold} ${group.name}`,
        fn: () => emitVkAudio({ type: 'wall', id: group.id })
      };
    }),
    {
      name: '{bold}VK{/bold} Add wall post',
      fn: () => urlPrompt(screen).then((data) => {
        let { url, name } = data;
        let id = url.split('vk.com/wall')[1];

        storage.data.vkWall.push({
          id: id,
          name: name
        });
        storage.save();

        renderLeftPane();
        leftPane.focus();

        emitVkAudio({ type: 'wall', id: id });
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
