import * as vk from 'vk-universal-api';
import inquirerCredentials from 'inquirer-credentials';
import _ from 'lodash';

import playlist from './playlist';
import * as player from './player/player-control';

import tui from './tui/render';
import { vkUrlPrompt, vkSearchPrompt } from './prompts/vk-prompts';

import loadVkAudio from './menu/vk-audio';

var token = {
  name: 'token',
  type: 'input',
  hint: 'https://oauth.vk.com/authorize?client_id=5075122&scope=audio,offline&redirect_uri=https://oauth.vk.com/blank.html&display=page&v=5.23&response_type=token',
  env: 'VK_TOKEN'
};

inquirerCredentials('.badtaste-npm-credentials', [token]).then(function(credentials) {
  vk.setToken(credentials.token);

  let { screen, leftPane, rightPane } = tui();

  player.setOnNextSong(() => {
    playlist.moveNext();
    player.play(playlist.getCurrent());

    rightPane.select(playlist.getCurrentIndex());
    rightPane.focus();
  });

  rightPane.on('select', function(item, index) {
    playlist.setCurrent(index);
    player.play(playlist.getCurrent());
  });

  let searchFn = () => vkSearchPrompt(screen, (query) => loadVkAudio({ type: 'search', query: query }, rightPane));

  let leftMenu = [
    {
      name: '{bold}VK{/bold} Profile',
      fn: () => loadVkAudio({ type: 'user' }, rightPane)
    },
    {
      name: '{bold}VK{/bold} Search',
      fn: searchFn
    },
    {
      name: '{bold}VK{/bold} Add group',
      fn: () => vkUrlPrompt(screen, (id) => loadVkAudio({ type: 'group', id: id }, rightPane))
    },
  ];

  let selectLeftPane = (item, index) => {
    leftMenu[index].fn();
  };

  leftPane.setItems(_.pluck(leftMenu, 'name'));
  leftPane.on('select', selectLeftPane);
  selectLeftPane(null, 0);

  screen.title = 'badtaste';
  screen.render();

  var isPlaying = true;
  screen.key(['space'], function(ch, key) {
    if (isPlaying) {
      player.stop();
    } else {
      player.play(playlist.getCurrent());
    }

    isPlaying = !isPlaying;
  });

  screen.key(['C-f'], function(ch, key) {
    leftPane.select(1); // @TODO: wow
    leftPane.focus();
    rightPane.focus();

    searchFn();
  });
});
