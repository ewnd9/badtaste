import { nameWithCount, selectOrSearch } from './menu';
import FileManager from './../file-manager';
import storage, { OPEN_FS, RENDER_LEFT_PANE } from './../../storage';

export default (screen, leftPane) => [
	{
		name: nameWithCount('{bold}FS{/bold} Play folder', storage.data.fs),
		fn: () => {
			selectOrSearch(screen, storage.data.fs, (i) => storage.emit(OPEN_FS, { path: storage.data.fs[i] }), () => {
				FileManager(screen).then((path) => {
					storage.data.fs.unshift(path);
					storage.save();

					storage.emit(RENDER_LEFT_PANE);
					storage.emit(OPEN_FS, { path: path });
				});
			});
		}
	}
];
