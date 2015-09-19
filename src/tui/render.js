import blessed from 'blessed';

import LeftPane from './left-pane';
import RightPane from './right-pane';
import HelpBox from './help-box';

export default () => {
  let screen = blessed.screen({
    smartCSR: true
  });
  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });

  let leftPane = new LeftPane(screen);
  let rightPane = new RightPane(screen);

  screen.key(['?', '/', '.', ','], function(ch, key) {
    HelpBox(screen);
    return true;
  });

  var focusCount = 1;
  screen.key(['m', 'ь'], function(ch, key) {
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
