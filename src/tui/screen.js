import Screen from './components/screen';

export default () => {
  const screen = Screen();
  screen.key(['escape', 'q', 'C-c'], () => {
    if (!screen.blockEsc) {
      process.exit(0);
    }
  });

  return screen;
};
