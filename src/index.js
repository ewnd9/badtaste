import tui from './tui/screen';
import setupCredentials from './helpers/credentials';
import startApp from './components/main';
import meow from 'meow';

import storage, { SEARCH_VK, PLAY, ADD_TO_PROFILE, SHOW_HELP, SWITCH_PANE, MOVE_TO_PLAYING } from './storage';

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
  screen.key(['space'], () => storage.emit(PLAY));
  screen.key(['x'], () => storage.emit(ADD_TO_PROFILE));
  screen.key(['m', 'ь'], () => storage.emit(SWITCH_PANE));
  screen.key(['d', 'в'], () => storage.emit(MOVE_TO_PLAYING));

  screen.key(['/', '?', '.', ','], () => storage.emit(SHOW_HELP));

  screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

  screen.title = 'badtaste';
  screen.render();

  process.title = 'badtaste';
});
