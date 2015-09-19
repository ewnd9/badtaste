import blessed from 'blessed';

import LeftPane from './left-pane';
import RightPane from './right-pane';

export default () => {
  let screen = blessed.screen({
    smartCSR: true
  });

  screen.title = 'playstream';

  let leftPane = new LeftPane(screen);
  let rightPane = new RightPane(screen);

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

  return {
    screen: screen,
    leftPane: leftPane,
    rightPane: rightPane
  };
};
