import Promise from 'bluebird';

import Box from './components/box';
import TextArea from './components/textarea';
import Text from './components/text';

export default (screen) => {
  const layout = Box(screen, '50%', '50%');
  const box = TextArea();

  const textContent = 'Paste tracklist, press esc.\nUnfortunately there is large input lag before text is actually pasted in form, don\'t close it';
  const text = Text(textContent, '100%-6');

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
