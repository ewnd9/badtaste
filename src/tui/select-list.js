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

  list.setItems(items);
  list.focus();

  screen.render();

  return new Promise((resolve, reject) => {
    list.on('select', (item, index) => {
      screen.remove(list);
      resolve(index);
    });
  });
};
