import * as vk from 'vk-universal-api';

import playlist from './../playlist';
import * as player from './../player/player-control';

export default (params, rightPane) => {
  let count = 1000;
  let offset = 0;

  let load = null;

  if (params.type === 'user' || params.type === 'group') {
    load = vk.method('audio.get', { need_user: 1, count: count, offset: offset * count, owner_id: params.id })
  } else if (params.type === 'search') {
    load = vk.method('audio.search', { need_user: 1, count: count, offset: offset * count, q: params.query })
  }

  load.then((result) => {
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
