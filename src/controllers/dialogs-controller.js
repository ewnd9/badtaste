import SelectList from '../tui/select-list';
import LoadingSpinner from '../tui/loading-spinner';
import InfoBox from '../tui/info-box';

import storage, {
  RENDER_LEFT_PANE,
  store,
} from '../storage';

import {
  VK_USER_PLAYLISTS_DIALOG,
  GM_ALBUMS_DIALOG,
  STATE_OPEN_DIALOG,
  STATE_CLOSE_DIALOG,
  STATE_START_SPINNER,
  STATE_STOP_SPINNER
} from '../actions/dialogs-actions';

import {
  dismissAlbums as vkDismissAlbums,
  fetchWallAudio
} from '../actions/vk-actions';

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
    vkUserPlaylists,
    gmAlbums,
    message,
    endMessage
  } = store.getState().dialogs;

  if (this.activeState === activeState) {
    return;
  }

  this.activeDialog = activeDialog;

  if (this.activeState === STATE_OPEN_DIALOG || this.activeState === STATE_CLOSE_DIALOG) {
    if (this.activeDialog === VK_USER_PLAYLISTS_DIALOG) {
      this.openVkUserPlaylistsDialog(vkUserPlaylists);
    } else if (this.activeDialog === GM_ALBUMS_DIALOG) {
      this.openGmAlbumsDialog(gmAlbums);
    }
  } else if (this.activeState === STATE_START_SPINNER) {
    this.spinner = LoadingSpinner(this.screen, message);
  } else if (this.activeState === STATE_STOP_SPINNER) {
    this.spinner.stop();
    InfoBox(this.screen, endMessage);
  }
};

DialogsController.prototype.openVkUserPlaylistsDialog = function(albums) {
  return SelectList(this.screen, albums.map(album => album.title))
    .then(index => {
      const album = albums[index];

      store.dispatch(vkDismissAlbums());
      store.dispatch(fetchWallAudio(album.owner_id, album.album_id));
    })
    .catch(err => {
      Logger.error(err);
      store.dispatch(vkDismissAlbums());
    });
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
