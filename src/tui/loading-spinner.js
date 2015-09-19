import blessed from 'blessed';

export default (screen, message, lockKeys = true) => {
  var loader = blessed.loading({
    parent: screen,
    border: 'line',
    height: 'shrink',
    width: 'half',
    top: 'center',
    left: 'center',
    label: ' {blue-fg}Loading{/blue-fg} ',
    tags: true,
    keys: true,
    hidden: true,
    vi: true
  });

  loader.load(message);

  screen.lockKeys = lockKeys;
  screen.key(['z'], (ch, key) => loader.stop());

  var superStop = loader.stop;
  loader.stop = () => {
    superStop.call(loader);
    screen.removeKey(['z'], (ch, key) => loader.stop());
  };

  return loader;
};
