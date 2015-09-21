import tui from './tui/screen';
import setupCredentials from './helpers/credentials';
import Main from './components/main';

import storage, { SEARCH_VK, PLAY, ADD_TO_PROFILE, SHOW_HELP, SWITCH_PANE } from './storage';

setupCredentials().then(() => {
  let screen = tui();
  let main = Main(screen);

  screen.key(['C-f'], () => storage.emit(SEARCH_VK));
  screen.key(['space'], () => storage.emit(PLAY));
  screen.key(['x'], () => storage.emit(ADD_TO_PROFILE));
  screen.key(['m', 'ь'], () => storage.emit(SWITCH_PANE));
  screen.key(['/', '?', '.', ','], () => storage.emit(SHOW_HELP));

  screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

  screen.title = 'badtaste';
  screen.render();

  process.title = 'badtaste';
});
