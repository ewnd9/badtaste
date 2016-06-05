import SelectList from '../tui/select-list';
import LoadingSpinner from '../tui/loading-spinner';
import InfoBox from '../tui/info-box';

import storage, {
  RENDER_LEFT_PANE,
  store,
} from '../storage';

import {
  GM_ALBUMS_DIALOG,
  STATE_OPEN_DIALOG,
  STATE_CLOSE_DIALOG,
  STATE_START_SPINNER,
  STATE_STOP_SPINNER
} from '../actions/dialogs-actions';

import {
  dismissAlbums as gmDismissAlbums,
  fetchAlbum
} from '../actions/gm-actions';

export default DialogsController;

function DialogsController(screen) {
  this.screen = screen;
  this.activeDialog = null;
  this.activeState = null;

  store.subscribe(this.onNextState.bind(this));
}

DialogsController.prototype.onNextState = function() {
  const {
    activeDialog,
    activeState,
    gmAlbums,
    message,
    endMessage
  } = store.getState().dialogs;

  if (this.activeState === activeState) {
    return;
  }

  this.activeDialog = activeDialog;

  if (this.activeState === STATE_OPEN_DIALOG || this.activeState === STATE_CLOSE_DIALOG) {
    if (this.activeDialog === GM_ALBUMS_DIALOG) {
      this.openGmAlbumsDialog(gmAlbums);
    }
  } else if (this.activeState === STATE_START_SPINNER) {
    this.spinner = LoadingSpinner(this.screen, message);
  } else if (this.activeState === STATE_STOP_SPINNER) {
    this.spinner.stop();
    InfoBox(this.screen, endMessage);
  }
};

DialogsController.prototype.openGmAlbumsDialog = function(albums) {
  const labels = albums.map(entry => `${entry.album.artist} - ${entry.album.name}`);

  return SelectList(screen, labels)
    .then(index => {
      const albumId = albums[index].album.albumId;

      storage.data.gmLinks.unshift({ // insert at the beginning
        name: labels[index],
        data: { albumId }
      });
      storage.save();

      store.dispatch(gmDismissAlbums());
      store.dispatch(fetchAlbum(albumId));

      storage.emit(RENDER_LEFT_PANE);
    })
    .catch(err => {
      Logger.error(err);
      store.dispatch(gmDismissAlbums());
    });
};
