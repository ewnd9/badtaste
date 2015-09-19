import * as vk from 'vk-universal-api';

import playlist from './../playlist';
import * as player from './../player/player-control';

export default (type, rightPane) => {
  let count = 1000;
  let offset = 0;

  vk.method('audio.get', { need_user: 1, count: count, offset: offset * count, owner_id: type.id }).then((result) => {
    let data = result.items;
    let urls = data.map((obj) => obj.url);

    playlist.setPlaylist(data);
    player.play(playlist.getCurrent());

    let isAdded = true;

    let titles = data.map(obj => {
      let result = '';

      result += isAdded ? ' + ' : '   ';
      result += `{bold}${obj.artist}{/bold} - ${obj.title}`.replace(/&amp;/g, '&');

      return result;
    });

    rightPane.setItems(titles);
    rightPane.focus();
  }).catch(console.log.bind(console));
};
