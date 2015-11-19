import PlayMusic from 'playmusic';
import Promise from 'bluebird';
import { format } from './music-actions';

export let pm = Promise.promisifyAll(new PlayMusic());

export let setCredentials = (credentials) => {
	return pm.initAsync(credentials);
};

export let getUrl = (track) => {
	return pm.getStreamUrlAsync(track.nid || track.id);
};

let processTracks = (tracks) => {
	let result = tracks.map((track) => {
		return {
			artist: track.artist,
			title: track.title,
			url: () => getUrl(track)
		};
	});

	return format(result);
};

export let getAlbum = (albumId) => {
	return pm.getAlbumAsync(albumId, true).then((fullAlbumDetails) => {
		return processTracks(fullAlbumDetails.tracks);
	});
};

export let findAlbum = (query) => {
	return pm.searchAsync(query, 20).then((results) => {
		return results.entries.filter((entry) => entry.type === '3' && entry.album);
	});
};

export let getThumbsUp = () => {
	return pm.getFavotitesAsync().then((data) => {
		return processTracks(data.track);
	});
};

export let getToken = (credentials) => {
	return pm.loginAsync(credentials);
};

export let isAllAccess = () => pm._allAccess;
