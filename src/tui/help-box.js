import blessed from 'blessed';
import _ from 'lodash';

export default (screen) => {
  var msg = blessed.message({
    parent: screen,
    border: 'line',
    height: 'shrink',
    width: 'half',
    top: 'center',
    left: 'center',
    label: ' {blue-fg}Help{/blue-fg}',
    tags: true,
    keys: true,
    hidden: true,
    vi: true
  });

  var lines = [];
  var addHotkey = (key, description) => lines.push(_.padRight(key, 8) + description);

  addHotkey('ctrl-f', 'search');
  addHotkey('space', 'play/stop');
  addHotkey('m', 'switch panes');
  addHotkey('q', 'exit');
  lines.push('\nPress any key to hide help box');

  msg.display(lines.join('\n'), 0, function(err) {

  });
};
