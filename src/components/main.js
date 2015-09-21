import storage, { OPEN_VK, PLAY, SHOW_HELP, SWITCH_PANE } from './../storage';

import LoadingSpinner from './../tui/loading-spinner';
import InfoBox from './../tui/info-box';
import HelpBox from './../tui/help-box';

import LeftPane from './../tui/left-pane';
import RightPane from './../tui/right-pane';

import LeftMenu from './left-menu';
import RightMenu from './right-menu';

let screen = null;
let leftPane = null;
let rightPane = null;

import * as player from './../player/player-control';

export default (_screen) => {
  screen = _screen;

  leftPane = new LeftPane(screen);
  rightPane = new RightPane(screen);

  let leftMenu = LeftMenu(screen, leftPane);
  let rightMenu = RightMenu(screen, rightPane);

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
