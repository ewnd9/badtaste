import * as vk from 'vk-universal-api';

import playlist from './../playlist';
import * as player from './../player/player-control';

let formatTrack = (track) => {
  let result = `{bold}${track.artist}{/bold} - ${track.title}`.replace(/&amp;/g, '&');

  if (track.notAvailable) {
    result = `Not Found: ${result}`;
  }

  return result;
};
export let formatTrackFull = (track) => (track.isAdded ? ' + ' : ' - ') + formatTrack(track);

let profileAudious = {};

import splitTracklist from 'split-tracklist';
import Promise from 'bluebird';

import LoadingSpinner from './../tui/loading-spinner'

export default (params, rightPane, screen) => {
  let count = 1000;
  let offset = 0;

  if (params.type == 'tracklist') {
    rightPane.setItems([]);
    playlist.setPlaylist([]);

    let spinner = LoadingSpinner(screen, 'Adding...');

    var tracklist = splitTracklist(params.tracklist);
    Promise.reduce(tracklist, (total, current) => {
      return Promise.delay(300).then(() => vk.method('audio.search', { need_user: 1, q: current.track }))
                               .then((response) => {
        var track = response.items[0];

        if (!track) {
          track = {
            notAvailable: true,
            artist: current.artist,
            title: current.title
          };
        }

        track.trackTitle = formatTrack(track);
        track.isAdded = typeof profileAudious[track.trackTitle] !== 'undefined';

        rightPane.pushItem(formatTrackFull(track));
        rightPane.focus();

        playlist.push(track);

        return total;
      });
    }, {}).then(() => spinner.stop())
          .catch(console.log.bind(console));
  } else {
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
  }
};
