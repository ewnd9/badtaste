export const PLAY = 'PLAY';
export const PAUSE = 'PAUSE';

export const UPDATE_RIGHT_PANE_ITEM = 'UPDATE_RIGHT_PANE_ITEM';

export const SEARCH_VK = 'SEARCH_VK';
export const ADD_TO_PROFILE = 'ADD_TO_PROFILE';
export const SWITCH_PANE = 'SWITCH_PANE';
export const FOCUS_LEFT_PANE = 'FOCUS_LEFT_PANE';
export const FOCUS_RIGHT_PANE = 'FOCUS_RIGHT_PANE';
export const MOVE_TO_PLAYING = 'MOVE_TO_PLAYING';

export const LOCAL_SEARCH = 'LOCAL_SEARCH';
export const RENDER_LEFT_PANE = 'RENDER_LEFT_PANE';

import createConfig from 'dot-file-config';
const storage = createConfig('.badtaste-npm', { cloudSync: false });

export default storage;

storage.data.vkLinks = storage.data.vkLinks || [];
storage.data.gmLinks = storage.data.gmLinks || [];
storage.data.fs = storage.data.fs || [];

import { EventEmitter } from 'events';
const emitter = new EventEmitter();

storage.emit = emitter.emit.bind(emitter);
storage.on = emitter.on.bind(emitter);

import createStore from './store';
export const store = createStore({
  menu: {
    vkLinks: storage.data.vkLinks,
    gmLinks: storage.data.gmLinks,
    fsLinks: storage.data.fs
  }
});

store.subscribe(() => {
  const { menu: { vkLinks, gmLinks, fsLinks } } = store.getState();

  const newHash = JSON.stringify({ vkLinks, gmLinks, fsLinks });
  const oldHash = JSON.stringify({
    vkLinks: storage.data.vkLinks,
    gmLinks: storage.data.gmLinks,
    fsLinks: storage.data.fs
  });

  if (newHash !== oldHash) {
    storage.data.vkLinks = vkLinks;
    storage.data.gmLinks = gmLinks;
    storage.data.fs = fsLinks;

    storage.save();
    Logger.info('config updated');
  }

});
