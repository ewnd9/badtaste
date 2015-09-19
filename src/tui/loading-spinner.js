import blessed from 'blessed';

export default (screen, message) => {
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
  return loader;
  // setTimeout(function() {
  //   loader.stop();
  //   screen.destroy();
  // }, 3000);
};
