import storage, { PLAY, SHOW_HELP, SWITCH_PANE, FOCUS_RIGHT_PANE } from './../storage';

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

  LeftMenu(screen, leftPane.box);
  RightMenu(screen, rightPane.box);

  storage.emit(FOCUS_RIGHT_PANE);
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

let focusPane = (pane1, pane2) => {
  pane1.line.show();
  pane1.box.focus();

  pane2.line.hide();
  screen.render();
};

storage.on(SWITCH_PANE, () => {
  if (leftPane.line.hidden) {
    focusPane(leftPane, rightPane);
  } else {
    focusPane(rightPane, leftPane);
  }
});

storage.on(FOCUS_RIGHT_PANE, () => {
  focusPane(rightPane, leftPane);
});
