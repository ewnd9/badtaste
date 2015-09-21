import * as vk from 'vk-universal-api';

import splitTracklist from 'split-tracklist';
import Promise from 'bluebird';
import _ from 'lodash';

let count = 1000;
let offset = 0;

let profileAudious = {};

let formatTrack = (track) => {
  let result = `{bold}${track.artist}{/bold} - ${track.title}`.replace(/&amp;/g, '&');
  let duration = _.padLeft(track.duration / 60 | 0, 2, '0') + ':' + _.padLeft(track.duration % 60, 2, '0');
  result += ` {|}${duration}`;

  if (track.notAvailable) {
    result = `Not Found: ${result}`;
  }

  return result;
};

export let formatTrackFull = (track) => (track.isAdded ? ' + ' : ' - ') + formatTrack(track);

let handleData = (result) => {
  let data = result.items;
  let urls = data.map((obj) => obj.url);

  let titles = data.map(obj => {
    obj.trackTitle = formatTrack(obj);

    obj.isAdded = typeof profileAudious[obj.trackTitle] !== 'undefined';
    obj.trackTitleFull = formatTrackFull(obj);

    return obj;
  });

  return titles;
}

export let getProfileAudio = () => {
  let request = vk.method('audio.get', { need_user: 1, count: count, offset: offset * count });
  return request.then(handleData).then((result) => {
    result.forEach((track) => {
      profileAudious[track.trackTitle] = true;

      track.isAdded = true;
      track.trackTitleFull = formatTrackFull(track);
    });
    return result;
  });
};

export let getGroupAudio = (groupId) => {
  let request = vk.method('audio.get', { need_user: 1, count: count, offset: offset * count, owner_id: groupId });
  return request.then(handleData);
};

export let getSearch = (query) => {
  let request = vk.method('audio.search', { need_user: 1, count: count, offset: offset * count, q: query });
  return request.then(handleData);
};

export let getBatchSearch = (text, onTrack) => {
  var tracklist = splitTracklist(text);
  return Promise.reduce(tracklist, (total, current, index) => {
    let delay = Promise.delay(300);
    let apiSearch = () => vk.method('audio.search', { need_user: 1, q: current.track });

    return delay.then(apiSearch).then((response) => {
      var track = response.items[0];
      return track;
    }, (err) => {
      Logger.error(err);
      return undefined;
    }).then((track) => {
      if (!track) {
        track = {
          notAvailable: true,
          artist: current.artist,
          title: current.title
        };
      }

      track.trackTitle = formatTrack(track);
      track.isAdded = typeof profileAudious[track.trackTitle] !== 'undefined';
      track.trackTitleFull = formatTrackFull(track);

      onTrack(track, index, tracklist.length);
      return total;
    });
  }, {});
};

export let addToProfile = (selected) => {
  return vk.method('audio.add', { audio_id: selected.aid , owner_id: selected.owner_id }).then((track) => {
    selected.isAdded = true;
    selected.trackTitleFull = formatTrackFull(selected);

    return selected;
  });
};

export let addOnTop = (selected) => {
  return vk.method('audio.get', { need_user: 1, count: 1 }).then((result) => {
    let currentTopTrack = result.items[0];
    return vk.method('audio.reorder', { audio_id: selected.aid, before: currentTopTrack.aid });
  });
}
