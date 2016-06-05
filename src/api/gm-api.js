import PlayMusic from 'playmusic';
import Promise from 'bluebird';
import { format } from './music-actions';

export const pm = Promise.promisifyAll(new PlayMusic());

export const setCredentials = credentials => {
  return pm.initAsync(credentials);
};

export const getUrl = track => {
  return pm.getStreamUrlAsync(track.id || track.nid);
};

const processTracks = tracks => {
  const result = tracks
    .map(track => {
      return {
        artist: track.artist,
        title: track.title,
        url: () => getUrl(track)
      };
    });

  return format(result);
};

export const getAlbum = albumId => {
  return pm
    .getAlbumAsync(albumId, true)
    .then(fullAlbumDetails => {
      return processTracks(fullAlbumDetails.tracks);
    });
};

export const getAlbums = query => {
  return pm
    .searchAsync(query, 20)
    .then(results => {
      return results.entries
        .filter(entry => entry.type === '3' && entry.album);
    });
};

export const getThumbsUp = () => {
  return pm
    .getFavotitesAsync()
    .then(data => {
      return processTracks(data.track);
    });
};

export const getAllTracks = () => {
  return pm
    .getAllTracksAsync()
    .then(data => {
      return processTracks(data.data.items);
    });
};

export const getToken = credentials => {
  return pm.loginAsync(credentials);
};

export const isAllAccess = () => pm._allAccess;
