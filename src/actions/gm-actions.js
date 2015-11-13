import PlayMusic from 'playmusic';
import Promise from 'bluebird';
import { format } from './music-actions';

export let pm = new PlayMusic();

export let setCredentials = (email, password) => {
	return new Promise((resolve, reject) => {
		pm.init({ email: email, password: password }, () => {
			resolve();
		});
	});
};

export let getUrl = (track) => {
	return new Promise((resolve, reject) => {
		pm.getStreamUrl(track.id || track.nid, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
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
	return new Promise((resolve, reject) => {
		pm.getAlbum(albumId, true, (err, fullAlbumDetails) => {
			if (err) {
				reject(err);
				return;
			}

			resolve(processTracks(fullAlbumDetails.tracks));
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

export let getThumbsUp = () => {
	return new Promise((resolve, reject) => {
		pm.getFavotites(function(err, data) {
			if (err) {
				reject(err);
				return;
			}

			resolve(processTracks(data.track));
		});
	});
}
