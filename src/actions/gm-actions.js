import PlayMusic from 'playmusic';
import Promise from 'bluebird';
import { format } from './music-actions';

let pm = new PlayMusic();

export let setCredentials = (email, password) => {
	return new Promise((resolve, reject) => {
		pm.init({ email: email, password: password }, () => {
			resolve();
		});
	});
};

export let getUrl = (track) => {
	return new Promise((resolve, reject) => {
		pm.getStreamUrl(track.nid, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
};

export let getAlbum = (albumId) => {
	return new Promise((resolve, reject) => {
		pm.getAlbum(albumId, true, (err, fullAlbumDetails) => {
			let result = fullAlbumDetails.tracks.map((track) => {
				return {
					artist: track.artist,
					title: track.title,
					url: () => getUrl(track)
				};
			});
			resolve(format(result));
		});
	});
};

export let findAlbum = (query) => {
	return new Promise((resolve, reject) => {
		pm.search(query, 20, function (err, results) {
			if (err) {
				reject(err);
			} else {
				resolve(results.entries.filter((entry) => entry.type === '3' && entry.album));
			}
		});
	});
};
