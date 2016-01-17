import { nameWithCount, selectOrSearch } from './menu';
import * as gmActions from './../../actions/gm-actions';

import SelectList from './../select-list';
import Toast from './../toast';

import storage, {
	OPEN_GM_ALBUM,
	OPEN_GM_THUMBS_UP,
	OPEN_GM_ALL_TRACKS,
	RENDER_LEFT_PANE
} from './../../storage';

export default (screen, leftPane) => {
	if (!storage.gmHasData()) {
		return [];
	}

	const gmLinks = storage.data.gmLinks;
	const result = [
		{
			name: '{bold}GM{/bold} Thumbs up',
			fn: () => storage.emit(OPEN_GM_THUMBS_UP)
		},
		{
			name: '{bold}GM{/bold} All Tracks',
			fn: () => storage.emit(OPEN_GM_ALL_TRACKS)
		}
	];

	if (gmActions.isAllAccess()) {
		result.push({
			name: nameWithCount('{bold}GM{/bold} Play album', gmLinks),
			fn: () => {
				const labels = gmLinks.map(link => link.name);
				selectOrSearch(screen, labels, (i) => storage.emit(OPEN_GM_ALBUM, gmLinks[i].data), () => {
					prompt(screen, 'Google Music', 'Search').then((query) => {
						return gmActions.findAlbum(query);
					}).then((result) => {
						const labels = result.map((entry) => `${entry.album.artist} - ${entry.album.name}`);
						return SelectList(screen, labels).then((index) => {
							const payload = { albumId: result[index].album.albumId };

							storage.data.gmLinks.unshift({
								data: payload,
								name: labels[index]
							});
							storage.save();

							storage.emit(RENDER_LEFT_PANE);
							storage.emit(OPEN_GM_ALBUM, payload);
						});
					}).catch((err) => {
						Logger.error(err);

						if (err.message === 'error getting album tracks: Error: 401 error from server') {
							Toast(screen, 'Auth error');
						}
					});
				});
			}
		});
	}

	return result;
};
