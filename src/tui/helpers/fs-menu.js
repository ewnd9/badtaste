import { nameWithCount, selectOrSearch } from './menu';
import FileManager from './../file-manager';
import storage, { RENDER_LEFT_PANE, store } from './../../storage';

import { fetchPath } from '../../actions/fs-actions';

export default (screen, fsLinks) => [
  {
    name: nameWithCount('{bold}FS{/bold} Play folder', fsLinks),
    fn: () => {
      const playPath = path => store.dispatch(fetchPath(path));
      const onSelectExisting = i => playPath(storage.data.fs[i]);
      const onSearchNew = () => {
        FileManager(screen)
          .then(path => {
            storage.data.fs.unshift(path); // insert at the beginning
            storage.save();

            storage.emit(RENDER_LEFT_PANE);
            playPath(path);
          });
      };

      selectOrSearch(screen, fsLinks, onSelectExisting, onSearchNew);
    }
  }
];
