import blessed from 'blessed';

export default () => {
  let screen = blessed.screen({
    smartCSR: true,
    debug: true
  });

  return screen;
};
