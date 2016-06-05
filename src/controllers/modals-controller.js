import storage, { store, RENDER_LEFT_PANE } from '../storage';
import SelectList from '../tui/select-list';

import {
  VK_SEARCH_MODAL,
  VK_LINKS_MODAL,
  VK_NEW_LINK_MODAL,
  VK_USER_PLAYLISTS_MODAL,
  GM_LINKS_MODAL,
  GM_ALBUMS_SEARCH_RESULT_MODAL,
  openVkNewLinkModal,
  openGmAlbumsSearchResultModal,
  resetModals
} from '../actions/modals-actions';

import {
  fetchSearchAudio,
  fetchAudioByUrl,
  fetchGroupAudio,
  fetchWallAudio,
  fetchGroupWall
} from '../actions/vk-actions';

import {
  fetchAlbum
} from '../actions/gm-actions';

import {
  prompt,
  urlPrompt,
  vkSearchPrompt
} from '../tui/vk-prompts';

function ModalsController(screen) {
  this.screen = screen;
  this.modal = null;

  const modals = {
    [GM_LINKS_MODAL]: this.renderGmLinksModal,
    [GM_ALBUMS_SEARCH_RESULT_MODAL]: this.renderGmAlbumsSearchResultModal,
    [VK_SEARCH_MODAL]: this.renderVkSearchModal,
    [VK_USER_PLAYLISTS_MODAL]: this.renderVkUserPlaylistsModal,
    [VK_LINKS_MODAL]: this.renderVkLinksModal,
    [VK_NEW_LINK_MODAL]: this.renderVkNewLinskModal
  };

  store.subscribe(() => {
    const { modal, props } = store.getState().modals;

    if (this.modal !== modal) {
      this.modal = modal;

      if (modal === null) {
        this.screen.render(); // flush previous modal
      } else {
        const fn = modals[modal];

        if (fn) {
          fn.apply(this, [props]);
        } else {
          throw new Error(`unknown modal ${modal}`);
        }
      }
    }
  });
}

export default ModalsController;

ModalsController.prototype.renderGmLinksModal = function() {
  const { gmLinks } = storage.data; // con be done later as part of redux state
  const labels = gmLinks.map(link => link.name);

  SelectList(this.screen, ['> Search'].concat(labels))
    .then(index => {
      store.dispatch(resetModals());

      if (index === 0) {
        prompt(this.screen, 'Google Music', 'Search')
          .then(query => store.dispatch(openGmAlbumsSearchResultModal(query)));
      } else {
        store.dispatch(fetchAlbum(gmLinks[index - 1].data.albumId));
      }
    }, () => Logger.info('SelectList closed by esc'));
};

ModalsController.prototype.renderGmAlbumsSearchResultModal = function(props) {
  const { albums } = props;
  const labels = albums.map(entry => `${entry.album.artist} - ${entry.album.name}`);

  return SelectList(this.screen, labels)
    .then(index => {
      store.dispatch(resetModals());
      const albumId = albums[index].album.albumId;

      storage.data.gmLinks.unshift({ // insert at the beginning
        name: labels[index],
        data: { albumId }
      });
      storage.save();

      store.dispatch(fetchAlbum(albumId));
      storage.emit(RENDER_LEFT_PANE);
    });
};

ModalsController.prototype.renderVkSearchModal = function() {
  vkSearchPrompt(this.screen) // can be done later as react component
    .then(query => {
      store.dispatch(resetModals());
      store.dispatch(fetchSearchAudio(query));
    });
};

ModalsController.prototype.renderVkUserPlaylistsModal = function(props) {
  const { albums } = props;

  SelectList(this.screen, albums.map(album => album.title))
    .then(index => {
      const album = albums[index];

      store.dispatch(resetModals());
      store.dispatch(fetchGroupAudio(album.owner_id, album.album_id));
    });
};

ModalsController.prototype.renderVkLinksModal = function() {
  const { vkLinks } = storage.data; // con be done later as part of redux state
  const labels = vkLinks.map(link => link.name);

  SelectList(this.screen, ['> Search'].concat(labels))
    .then(index => {
      store.dispatch(resetModals());

      if (index === 0) {
        store.dispatch(openVkNewLinkModal());
      } else {
        const data = vkLinks[index - 1].data;

        if (data.url) {
          store.dispatch(fetchAudioByUrl(data.url));
        } else if (data.type === 'audio') {
          store.dispatch(fetchGroupAudio(data.owner_id, data.album_id));
        } else if (data.type === 'wall') {
          store.dispatch(fetchWallAudio(data.id));
        } else if (data.type === 'full-wall') {
          store.dispatch(fetchGroupWall(data.id));
        }
      }
    }, () => Logger.info('SelectList closed by esc'));
};

ModalsController.prototype.renderVkNewLinskModal = function() {
  const { vkLinks } = storage.data; // con be done later as part of redux state

  const urlsExamples = [
    'Enter url like:',
    '',
    'vk.com/audios1?album_id=1',
    'vk.com/wall1',
    'vk.com/user1'
  ];

  urlPrompt(this.screen, urlsExamples, 'Enter alias for menu')
    .then(promptResult => {
      store.dispatch(resetModals());

      vkLinks.unshift({ // insert at the beginning
        name: promptResult.name,
        data: { url: promptResult.url }
      });
      storage.save();

      storage.emit(RENDER_LEFT_PANE);
      store.dispatch(fetchAudioByUrl(promptResult.url));
    });
};
