import tui from './tui/screen';
import setupCredentials from './helpers/credentials';
import startApp from './components/main';
import meow from 'meow';

import storage, { SEARCH_VK, PAUSE, ADD_TO_PROFILE, SHOW_HELP, SWITCH_PANE, MOVE_TO_PLAYING, FOCUS_LEFT_PANE, FOCUS_RIGHT_PANE, LOCAL_SEARCH } from './storage';

let cli = meow(`
  Usage
    $ badtaste

  Options
    --setup Setup vk and google music login credentials
`, {
  pkg: './../package.json'
});

setupCredentials(cli.flags.setup).then(() => {
  let screen = tui();
  startApp(screen);

  screen.key(['C-f'], () => storage.emit(SEARCH_VK));
  screen.key(['f'], () => storage.emit(LOCAL_SEARCH));
  screen.key(['space'], () => storage.emit(PAUSE));
  screen.key(['x'], () => storage.emit(ADD_TO_PROFILE));
  screen.key(['m', 'ь'], () => storage.emit(SWITCH_PANE));
  screen.key(['d', 'в'], () => storage.emit(MOVE_TO_PLAYING));

  screen.key(['left'], () => storage.emit(FOCUS_LEFT_PANE));
  screen.key(['right'], () => storage.emit(FOCUS_RIGHT_PANE));

  screen.key(['/', '?', '.', ','], () => storage.emit(SHOW_HELP));

  screen.key(['escape', 'q', 'C-c'], () => {
    if (!screen.blockEsc) {
      process.exit(0);
    }
  });

  screen.title = 'badtaste';
  screen.render();

  process.title = 'badtaste';
});
