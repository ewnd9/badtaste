import blessed from 'blessed';
import Promise from 'bluebird';

import { Layout, TextArea, Text } from './components/tracklist-prompt-components';

export default (screen) => {
  const layout = Layout(screen);
  const box = TextArea();
  const text = Text();

  layout.append(text);
  layout.append(box, 5);

  box.focus();
  box.on('action', () => screen.render());

  screen.key('i', function() {
    box.readInput(function() {});
  });

  screen.render();

  return new Promise((resolve, reject) => {
    box.on('blur', () => {
      screen.remove(layout);
      resolve(box.value);
    });
  });
};
