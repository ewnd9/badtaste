import PlayMusic from 'playmusic';
import Promise from 'bluebird';
import { format } from './music-actions';

export let pm = Promise.promisifyAll(new PlayMusic());

export let setCredentials = (email, password) => {
	return pm.initAsync({ email: email, password: password });
};

export let getUrl = (track) => {
	return pm.getStreamUrlAsync(track.nid);
};

export let getAlbum = (albumId) => {
	return pm.getAlbumAsync(albumId, true).then((fullAlbumDetails) => {
		let result = fullAlbumDetails.tracks.map((track) => {
			return {
				artist: track.artist,
				title: track.title,
				url: () => getUrl(track)
			};
		});
		return format(result);
	});
};

export let findAlbum = (query) => {
	return pm.searchAsync(query, 20).then((results) => {
		return results.entries.filter((entry) => entry.type === '3' && entry.album);
	});
};
