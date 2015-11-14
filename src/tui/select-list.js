import blessed from 'blessed';
import style from './list-style';

import Promise from 'bluebird';

export default (screen, items) => {
  let list = blessed.list({
    ...style,
    top: 'center',
    left: 'center',
    width: '50%',
    height: '50%',
    border: {
      type: 'line'
    }
  });

  screen.append(list);
  screen.saveFocus();

  list.setItems(items);
  list.focus();

  screen.render();

  let keepFocus = () => list.focus();
  list.on('blur', keepFocus);

  let done = () => {
    list.removeListener('blur', keepFocus);
    list.removeScreenEvent('keypress', press);

    screen.remove(list);
    screen.restoreFocus();
    screen.render();

    setTimeout(() => screen.blockEsc = false, 1000);
  };

  let press = (ch, key) => {
    if (key.name === 'escape') {
      done();
      return;
    }
  };
  list.onScreenEvent('keypress', press);

  screen.blockEsc = true;

  return new Promise((resolve, reject) => {
    list.on('select', (item, index) => {
      done();
      resolve(index);
    });
  });
};
