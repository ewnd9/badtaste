import blessed from 'blessed';
import _ from 'lodash';
import storage from './../storage';

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

  addHotkey('f', 'local search');
  addHotkey('space', 'play/stop');
  addHotkey('m', 'switch focused pane');

  addHotkey('ctrl-f', 'VK: search');
  addHotkey('x', 'VK: add track to profile audio');

  lines.push('');

  addHotkey('d', 'select playing track');
  addHotkey('g', 'move to the beginning');
  addHotkey('G', 'move to the end');

  lines.push('');

  addHotkey('q', 'exit');

  lines.push('');

  lines.push('Storage file ' + storage.path);
  lines.push('Press any key to hide help box');

  msg.display(lines.join('\n'), 0, function(err) {
    Logger.error(err);
  });
};
