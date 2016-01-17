import blessed from 'blessed';

export default () => {
  const screen = blessed.screen({
    smartCSR: true,
    debug: true
  });

  screen.key(['escape', 'q', 'C-c'], () => {
    if (!screen.blockEsc) {
      process.exit(0);
    }
  });

  return screen;
};
