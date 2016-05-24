import * as vk from 'vk-universal-api';

import splitTracklist from 'split-tracklist';
import Promise from 'bluebird';

import { formatTrack } from './music-actions';

const count = 1000;
const offset = 0;

const profileAudious = {};
const formatTrackFull = track => (track.isAdded ? ' + ' : ' - ') + formatTrack(track);

const handleData = result => {
  return result
    .filter(obj => obj.artist && obj.title)
    .map(obj => {
      obj.isAdded = typeof profileAudious[obj.artist + obj.title] !== 'undefined';

      obj.artist = obj.artist.replace(/&amp;/g, '&');
      obj.title = obj.title.replace(/&amp;/g, '&');

      obj.trackTitleFull = formatTrackFull(obj);
      return obj;
    });
};

export const getProfileAudio = () => {
  const params = { need_user: 1, count: count, offset: offset * count };

  return vk
    .method('audio.get', params)
    .then(response => {
      response.items.forEach(track => {
        profileAudious[track.artist + track.title] = true;
      });

      return response.items;
    })
    .then(response => handleData(response));
};

export const getGroupAudio = (groupId, albumId) => {
  const params = { need_user: 1, count: count, offset: offset * count, owner_id: groupId, album_id: albumId };

  return vk
    .method('audio.get', params)
    .then(response => handleData(response.items));
};

export const getWallAudio = id => {
  const params = { posts: [id] };

  return vk
    .method('wall.getById', params, { transformResponse: false })
    .then(result => {
      const attachments = result.body.response[0].attachments
        .filter(a => a.type === 'audio')
        .map(a => a.audio);
      return handleData(attachments);
    });
};

export const getRecommendations = () => {
  return vk
    .method('audio.getRecommendations')
    .then(response => handleData(response.items));
};

export const getAlbums = () => {
  return vk
    .method('audio.getAlbums')
    .then(response => response.items);
};

export const getSearch = query => {
  const params = { need_user: 1, count: count, offset: offset * count, q: query };

  return vk
    .method('audio.search', params)
    .then(response => handleData(response.items));
};

export const getBatchSearch = (text, onTrack) => {
  const tracklist = splitTracklist(text);

  return Promise
    .reduce(tracklist, (total, current, index) => {
      const delay = Promise.delay(300);
      const apiSearch = () => vk.method('audio.search', { need_user: 1, q: current.track });

      return delay
        .then(apiSearch)
        .then(response => {
          const track = response.items[0];
          return track;
        }, err => {
          Logger.error(err);
          return undefined;
        })
        .then(track => {
          if (!track) {
            track = {
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

export const addToProfile = selected => {
  const params = { audio_id: selected.aid , owner_id: selected.owner_id };

  return vk
    .method('audio.add', params)
    // .then(track => {
    .then(() => {
      selected.isAdded = true;
      selected.trackTitleFull = formatTrackFull(selected);

      return selected;
    });
};

export const addOnTop = selected => {
  const params = { need_user: 1, count: 1 };

  return vk
    .method('audio.get', params)
    .then(result => {
      const currentTopTrack = result.items[0];
      return vk.method('audio.reorder', { audio_id: selected.aid, before: currentTopTrack.aid });
    });
};

export const resolveScreenName = screenName => {
  return vk.method('utils.resolveScreenName', { screen_name: screenName });
};

export const getUserInfo = () => vk.method('users.get');
export const setToken = token => vk.setToken(token);
