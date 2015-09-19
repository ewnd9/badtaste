import * as vk from 'vk-universal-api';
import inquirerCredentials from 'inquirer-credentials';
import _ from 'lodash';

import playlist from './playlist';
import * as player from './player/player-control';
import tui from './tui/render';
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

  let leftMenu = [
    {
      name: '{bold}VK{/bold} profile',
      fn: () => loadVkAudio({ type: 'user' }, rightPane)
    },
    {
      name: '{bold}VK{/bold} noisia',
      fn: () => loadVkAudio({ type: 'group', id: '-26942782' }, rightPane)
    },
    {
      name: '{bold}VK{/bold} boards of canada',
      fn: () => loadVkAudio({ type: 'group', id: '-173328' }, rightPane)
    },
    {
      name: 'Add more...',
      fn: () => console.log('hi')
    }
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
});
