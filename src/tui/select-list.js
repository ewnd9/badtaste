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

  let keepFocus = () => list.focus();
  list.on('blur', keepFocus);

  screen.render();

  return new Promise((resolve, reject) => {
    list.on('select', (item, index) => {
      list.removeListener('blur', keepFocus);
      screen.remove(list);
      
      resolve(index);
    });
  });
};
