import * as vk from 'vk-universal-api';

import playlist from './../playlist';
import * as player from './../player/player-control';

let formatTrack = (track) => `{bold}${track.artist}{/bold} - ${track.title}`.replace(/&amp;/g, '&');
export let formatTrackFull = (track) => (track.isAdded ? ' + ' : ' - ') + formatTrack(track);

let profileAudious = {};

export default (params, rightPane) => {
  let count = 1000;
  let offset = 0;

  let load = null;

  if (params.type === 'profile' || params.type === 'group') {
    load = vk.method('audio.get', { need_user: 1, count: count, offset: offset * count, owner_id: params.id });

    if (params.type === 'profile') {
      load = load.then((result) => {
        result.items.forEach((track) => profileAudious[formatTrack(track)] = true);
        return result;
      });
    };
  } else if (params.type === 'search') {
    load = vk.method('audio.search', { need_user: 1, count: count, offset: offset * count, q: params.query });
  }

  load.then((result) => {
    let data = result.items;
    let urls = data.map((obj) => obj.url);

    playlist.setPlaylist(data);
    player.play(playlist.getCurrent());

    let titles = data.map(obj => {
      obj.trackTitle = formatTrack(obj);
      obj.isAdded = typeof profileAudious[obj.trackTitle] !== 'undefined';

      return formatTrackFull(obj);
    });

    rightPane.setItems(titles);
    rightPane.focus();
  }).catch(console.log.bind(console));
};
