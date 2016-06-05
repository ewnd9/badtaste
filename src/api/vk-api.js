import * as vk from 'vk-universal-api';

import splitTracklist from 'split-tracklist';
import Promise from 'bluebird';
import got from 'got';

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
      const attachments = _filterWallAudio(result.body.response[0]);
      return handleData(attachments);
    });
};

export const getWall = id => {
  const params = { owner_id: id };

  return vk
    .method('wall.get', params, { transformResponse: false })
    .then(result => {
      const response = result.body.response;
      return Promise.all(response.slice(1).map(_getWallPostPlaylist));
    })
    .then(result => {
      return result.reduce((total, curr) => total.concat(curr), []);
    });
};

const _getWallPostPlaylist = wallPost => {
  const text = wallPost.text.split('<br>').join('\n');
  const tracks = splitTracklist(text);

  const title = tracks.length > 0 ? tracks[0].track : text.substr(0, 50);
  const titleObj = { trackTitleFull: formatTrackFull({ label: title }) };

  const playlistUrlMatch = _extractPlaylistUrl(wallPost.text);

  if (playlistUrlMatch) {
    return getGroupAudio(playlistUrlMatch.ownerId, playlistUrlMatch.playlistId)
      .then(result => [titleObj].concat(result));
  }

  const match = /(vk\.cc\/[\w\d]+)/.exec(wallPost.text);

  if (!match) {
    return [titleObj].concat(handleData(_filterWallAudio(wallPost)));
  }

  const url = `https://${match[1]}`;

  return got(url, { followRedirect: false })
    .then(res => {
      const location = res.headers.location;
      const playlistUrlMatch =  _extractPlaylistUrl(location);

      if (playlistUrlMatch) {
        return getGroupAudio(playlistUrlMatch.ownerId, playlistUrlMatch.playlistId);
      } else {
        return [];
      }
    })
    .then(audios => {
      return [titleObj].concat(audios);
    });
};

const _extractPlaylistUrl = url => {
  const match = /vk\.com\/audios([-\d]+)\?album_id=([\d]+)/.exec(url);

  if (!match) {
    return null;
  }

  const ownerId = match[1];
  const playlistId = match[2];

  return { ownerId, playlistId };
};

const _filterWallAudio = wallPost => {
  return wallPost.attachments
    .filter(a => a.type === 'audio')
    .map(a => a.audio);
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

const communityRegex = /.*vk.com\/([\S]+)/;

export const getOwnerIdByUrl = url => {
  const communityMatch = communityRegex.exec(url);

  if (!communityMatch) {
    return Promise.reject(new Error(`Wrong url: ${url}`));
  }

  const screenName = communityMatch[1];

  return resolveScreenName(screenName)
    .then(res => {
      if (!res.object_id) {
        return Promise.reject(new Error(`Noting found by ${screenName}`));
      }
      
      return res.type === 'group' ? -1 * res.object_id : res.object_id;
    });
};

export const getUserInfo = () => vk.method('users.get');
export const setToken = token => vk.setToken(token);
