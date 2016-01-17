import Promise from 'bluebird';

import {
  Layout,
  FileManager,
  Text
} from './components/file-manager-components';

export default (screen) => {
  const layout = Layout(screen);
  const fm = FileManager();
  const text = Text();

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
