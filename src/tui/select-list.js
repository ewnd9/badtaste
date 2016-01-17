import blessed from 'blessed';
import Promise from 'bluebird';

import { SelectList } from './components/lists-components';

export default (screen, items) => {
  const list = SelectList();

  screen.append(list);
  screen.saveFocus();

  list.setItems(items);
  list.focus();

  screen.render();

  const keepFocus = () => list.focus();
  list.on('blur', keepFocus);

  const done = () => {
    list.removeListener('blur', keepFocus);
    list.removeScreenEvent('keypress', press);

    screen.remove(list);
    screen.restoreFocus();
    screen.render();

    setTimeout(() => screen.blockEsc = false, 1000);
  };

  const press = (ch, key) => {
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
