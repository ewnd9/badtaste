import storage, { PLAY, SHOW_HELP, SWITCH_PANE } from './../storage';

import HelpBox from './../tui/help-box';

import LeftPane from './../tui/left-pane';
import RightPane from './../tui/right-pane';

import LeftMenu from './left-menu';
import RightMenu from './right-menu';

let screen = null;
let leftPane = null;
let rightPane = null;

import * as player from './../player/player-control';
import playlist from './../playlist';

export default (_screen) => {
  screen = _screen;

  leftPane = new LeftPane(screen);
  rightPane = new RightPane(screen);

  LeftMenu(screen, leftPane);
  RightMenu(screen, rightPane);

  rightPane.focus();
  screen.render();
};

var isPlaying = true;
storage.on(PLAY, () => {
  if (isPlaying) {
    player.stop();
  } else {
    player.play(playlist.getCurrent());
  }

  isPlaying = !isPlaying;
});

storage.on(SHOW_HELP, () => HelpBox(screen));

var focusCount = 1;
storage.on(SWITCH_PANE, () => {
  if ((focusCount++ % 2) === 0) {
    rightPane.focus();
  } else {
    leftPane.focus();
  }
});
