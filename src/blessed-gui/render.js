import blessed from 'blessed';

export let screen = blessed.screen({
  smartCSR: true
});

screen.title = 'playstream';

import LeftPane from './left-pane';
export let leftPane = new LeftPane(screen);

import RightPane from './right-pane';
export let rightPane = new RightPane(screen);

var focusCount = 1;
screen.key(['m'], function(ch, key) {
  if ((focusCount++ % 2) === 0) {
    rightPane.focus();
  } else {
    leftPane.focus();
  }
  return true;
});

rightPane.focus();
screen.render();
