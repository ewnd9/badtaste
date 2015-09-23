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
    style: {
      bg: 'black'
    },
    height: '100%-5'
  });

  var text = blessed.text({
    content: 'Press i, then paste tracklist, then press esc, then press enter',
    top: '100%-4',
    align: 'middle'
  });

  layout.append(text);
  layout.append(box, 5);

  box.focus();

  screen.key('i', function() {
    box.readInput(function() {});
  });

  return new Promise((resolve, reject) => {
    screen.key('enter', function() {
      layout.detach();
      resolve(box.value);
    });
  });
};
