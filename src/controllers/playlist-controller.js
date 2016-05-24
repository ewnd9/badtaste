import storage, {
  ADD_TO_PROFILE,
  FOCUS_RIGHT_PANE,
  MOVE_TO_PLAYING,
  LOCAL_SEARCH,
  UPDATE_RIGHT_PANE_ITEM,
  store,
  player
} from '../storage';

import _ from 'lodash';

import { prompt } from '../tui/vk-prompts';

import {
  setCurrentIndex,
  moveNext,
  filterPlaylist
} from '../actions/playlist-actions';

import {
  vkAddToProfile,
  vkAddOnTop
} from '../actions/dialogs-actions';

export default PlaylistController;

function PlaylistController(screen, rightPane) {
  this.screen = screen;
  this.rightPane = rightPane;

  this.playlist = null;
  this.currentIndex = null;

  this.rightPane.on('select', (item, index) => {
    store.dispatch(setCurrentIndex(index));
  });

  player.setOnNextSongCallback(() => store.dispatch(moveNext()));

  store.subscribe(() => {
    const state = store.getState().playlist;

    if (state.playlist !== this.playlist && state.playlist.length > 0) {
      this.playlist = state.playlist;

      this.setAudio(this.playlist);
      storage.emit(FOCUS_RIGHT_PANE);
    }

    if (state.currentIndex !== this.currentIndex) {
      this.currentIndex = state.currentIndex;

      this.rightPane.select(this.currentIndex);
      storage.emit(FOCUS_RIGHT_PANE);
    }
  });

  storage.on(MOVE_TO_PLAYING, () => this.rightPane.select(this.currentIndex));

  storage.on(LOCAL_SEARCH, () => {
    prompt(this.screen, 'Search', '').then(query => store.dispatch(filterPlaylist(query)));
  });

  storage.on(ADD_TO_PROFILE, () => {
    const selected = this.playlist[this.rightPane.selected];
    const listEl = this.rightPane.items[this.rightPane.selected];

    if (selected.isAdded) {
      store.dispatch(vkAddOnTop({ selected, listEl }));
    } else {
      store.dispatch(vkAddToProfile({ selected, listEl }));
    }
  });

  storage.on(UPDATE_RIGHT_PANE_ITEM, ({ item, text}) => {
    this.rightPane.setItem(item, text);
  });
}

PlaylistController.prototype.setListElements = function(elements) {
  this.rightPane.clearItems();
  this.rightPane.setItems(elements);
};

PlaylistController.prototype.setAudio = function(audio) {
  this.setListElements(_.pluck(audio, 'trackTitleFull'));
  storage.emit(FOCUS_RIGHT_PANE);
};
