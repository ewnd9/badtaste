var storage = require('dot-file-config')('.badtaste-npm', {
  cloudSync: false
});

storage.data.vkLinks = storage.data.vkLinks || [];
storage.data.gmLinks = storage.data.gmLinks || [];
storage.data.fs = storage.data.fs || [];

import events from 'events';

let EventEmitter = events.EventEmitter;
let emitter = new EventEmitter();

storage.emit = emitter.emit.bind(emitter);
storage.on = emitter.on.bind(emitter);

export const OPEN_VK = 'OPEN_VK';
export const SEARCH_VK = 'SEARCH_VK';
export const PAUSE = 'PAUSE';
export const ADD_TO_PROFILE = 'ADD_TO_PROFILE';
export const SWITCH_PANE = 'SWITCH_PANE';
export const FOCUS_LEFT_PANE = 'FOCUS_LEFT_PANE';
export const FOCUS_RIGHT_PANE = 'FOCUS_RIGHT_PANE';
export const MOVE_TO_PLAYING = 'MOVE_TO_PLAYING';
export const OPEN_FS = 'OPEN_FS';
export const OPEN_GM_ALBUM = 'OPEN_GM_ALBUM';
export const OPEN_GM_THUMBS_UP = 'OPEN_GM_THUMBS_UP';
export const OPEN_GM_ALL_TRACKS = 'OPEN_GM_ALL_TRACKS';

export default storage;
