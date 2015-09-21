import _ from 'lodash';
import storage, { OPEN_VK, SEARCH_VK } from './../storage';
import { vkUrlPrompt, vkSearchPrompt } from './../prompts/vk-prompts';
import TracklistPrompt from './../tui/tracklist-prompt';

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
        name: `{bold}VK{/bold} Custom: ${group.name}`,
        fn: () => emitVkAudio({ type: 'group', id: group.id })
      }
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
    {
      name: '{bold}VK{/bold} Add playlist',
      fn: () => TracklistPrompt(screen).then((text) => {
        emitVkAudio({ type: 'tracklist', tracklist: text });
      })
    },
  ];

  leftMenu = _.flatten(leftMenuRaw);
  leftPane.setItems(_.pluck(leftMenu, 'name'));
};
