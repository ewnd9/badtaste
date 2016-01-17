import Promise from 'bluebird';

import FileManager from './components/file-manager';
import Box from './components/box';
import Text from './components/text';

export default (screen) => {
  const layout = Box(screen, '90%', '90%');
  const fm = FileManager();
  const text = Text('Press "s" to play directory', '100%-3');

  layout.append(fm);
  layout.append(text);

  return new Promise((resolve, reject) => {
    let lastCd = process.env.HOME;

    fm.on('cd', (file) => {
      lastCd = file;
    });

    fm.refresh();
    fm.focus();

    screen.key(['s'], function(ch, key) {
      layout.destroy();

      const content = fm.items[fm.selected].content;
      const escaped = content.replace(/\{[^{}]+\}/g, '').replace(/@$/, '');
      const result = lastCd + '/' + escaped;

      return resolve(result);
    });
  });
};
