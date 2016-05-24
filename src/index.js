import updateNotifier from 'update-notifier';
import meow from 'meow';

import setupCredentials from './helpers/credentials';
import tui from './tui/screen';
import MainController from './controllers/main-controller';

import storage, {
  SEARCH_VK,
  PAUSE,
  ADD_TO_PROFILE,
  SHOW_HELP,
  SWITCH_PANE,
  MOVE_TO_PLAYING,
  FOCUS_LEFT_PANE,
  FOCUS_RIGHT_PANE,
  LOCAL_SEARCH
} from './storage';

const cli = meow(`
  Usage
    $ badtaste

  Options
    --setup Setup vk and google music login credentials
`, {
  pkg: '../package.json'
});

setupCredentials(cli.flags.setup)
  .then(() => {
    const screen = tui();
    const main = new MainController(screen);

    screen.key(['C-f'], () => storage.emit(SEARCH_VK));
    screen.key(['f'], () => storage.emit(LOCAL_SEARCH));
    screen.key(['space'], () => storage.emit(PAUSE));
    screen.key(['x'], () => storage.emit(ADD_TO_PROFILE));
    screen.key(['m', 'ь'], () => storage.emit(SWITCH_PANE));
    screen.key(['d', 'в'], () => storage.emit(MOVE_TO_PLAYING));

    screen.key(['left'], () => storage.emit(FOCUS_LEFT_PANE));
    screen.key(['right'], () => storage.emit(FOCUS_RIGHT_PANE));

    screen.key(['/', '?', '.', ','], () => storage.emit(SHOW_HELP));

    screen.title = 'badtaste';
    screen.render();

    process.title = 'badtaste';

    return main;
  })
  .catch(err => {
    Logger.error(err);
  });
