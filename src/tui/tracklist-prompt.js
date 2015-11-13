import blessed from 'blessed';
import Promise from 'bluebird';

export default (screen) => {
  var layout = blessed.box({
    parent: screen,
    top: 'center',
    left: 'center',
    width: '50%',
    height: '50%',
    tags: true,
    border: {
      type: 'line'
    }
  });

  var box = blessed.textarea({
    inputOnFocus: true,
    style: {
      bg: 'black'
    },
    keys: true,
    height: '100%-6'
  });

  var text = blessed.text({
    content: 'Paste tracklist, press esc.\nUnfortunately there is large input lag before text is actually pasted in form, don\'t close it',
    top: '100%-6',
    align: 'middle'
  });

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
