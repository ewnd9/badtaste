import storage, { PAUSE, SHOW_HELP, SWITCH_PANE, FOCUS_LEFT_PANE, FOCUS_RIGHT_PANE } from './../storage';

import HelpBox from './help-box';

import List from './components/list';
import Line from './components/line';

import LeftMenu from './left-menu';
import RightMenu from './right-menu';

let screen;
let leftPane;
let rightPane;

import * as player from './../player/player-control';
import playlist from './../playlist';

export default (_screen) => {
  screen = _screen;

  leftPane = {
    box: List(screen, {
    	left: 0,
    	width: '30%',
    	items: ['Loading']
    }),
    line: Line(screen, { left: 1, width: '30%-3' })
  };

  rightPane = {
    box: List(screen, {
    	left: '30%',
    	width: '70%',
    	items: ['{bold}Loading{/bold}, please wait']
    }),
    line: Line(screen, { left: '30%+1', width: '70%-3' })
  };

  LeftMenu(screen, leftPane.box);
  RightMenu(screen, rightPane.box);

  storage.emit(FOCUS_RIGHT_PANE);
};

storage.on(PAUSE, () => player.pause());
storage.on(SHOW_HELP, () => HelpBox(screen));

const focusPane = (pane1, pane2) => {
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

storage.on(FOCUS_LEFT_PANE, () => {
  focusPane(leftPane, rightPane);
});

storage.on(FOCUS_RIGHT_PANE, () => {
  focusPane(rightPane, leftPane);
});
