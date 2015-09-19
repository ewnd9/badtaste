import blessed from 'blessed';

export default (screen, message) => {
  var msg = blessed.message({
    parent: screen,
    border: 'line',
    height: 'shrink',
    width: 'half',
    top: 'center',
    left: 'center',
    label: ' {blue-fg}Info{/blue-fg}',
    tags: true,
    keys: true,
    hidden: true,
    vi: true
  });

  msg.display(message, 1, function(err) {

  });
};
