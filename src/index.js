import * as vk from 'vk-universal-api';
import inquirerCredentials from 'inquirer-credentials';

import playlist from './playlist';
import * as player from './player/player-control';
import tui from './tui/render';

var token = {
  name: 'token',
  type: 'input',
  hint: 'https://oauth.vk.com/authorize?client_id=5075122&scope=audio,offline&redirect_uri=https://oauth.vk.com/blank.html&display=page&v=5.23&response_type=token',
  env: 'VK_TOKEN'
};

inquirerCredentials('.badtaste-npm-credentials', [token]).then(function(credentials) {
  vk.setToken(credentials.token);

  let count = 1000;
  let offset = 0;

  vk.method('audio.get', { need_user: 1, count: count, offset: offset * count }).then((result) => {
    init(result.items);
  }).catch(console.log.bind(console));
});

let init = (data) => {
  let { screen, leftPane, rightPane } = tui();
  let urls = data.map((obj) => obj.url);

  let isAdded = true;

  let titles = data.map(obj => {
    let result = '';

    result += isAdded ? ' + ' : '   ';
    result += `{bold}${obj.artist}{/bold} - ${obj.title}`.replace(/&amp;/g, '&');

    return result;
  });

  playlist.setPlaylist(data);

  player.play(playlist.getCurrent());
  player.setOnNextSong(() => {
    playlist.moveNext();
    player.play(playlist.getCurrent());

    rightPane.select(playlist.getCurrentIndex());
    rightPane.focus();
  });

  rightPane.setItems(titles);
  rightPane.on('select', function(item, index) {
    playlist.setCurrent(index);
    player.play(playlist.getCurrent());
  });

  let vkUserPageMenu = '{bold}VK{/bold} audio';
  let addMoreMenu = 'Add more...';

  leftPane.setItems([vkUserPageMenu, addMoreMenu]);
  leftPane.on('select', (item, index) => {
    console.log(item);
  });

  screen.title = 'badtaste';
  screen.render();

  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });

  var isPlaying = true;
  screen.key(['space'], function(ch, key) {
    if (isPlaying) {
      player.stop();
    } else {
      player.play(playlist.getCurrent());
    }

    isPlaying = !isPlaying;
  });
};
