import meow from 'meow';

import setupCredentials from './helpers/credentials';
import tui from './tui/screen';
import MainController from './controllers/main-controller';

import storage, {
  store,
  SEARCH_VK,
  PLAY,
  PAUSE,
  ADD_TO_PROFILE,
  SHOW_HELP,
  SWITCH_PANE,
  MOVE_TO_PLAYING,
  FOCUS_LEFT_PANE,
  FOCUS_RIGHT_PANE,
  LOCAL_SEARCH
} from './storage';

import {
  moveNext
} from './actions/playlist-actions';

import NodePlayer from './player/player-control';
import MpdPlayer from './lib/mpd-wrapper/index';
import exitHook from 'exit-hook';

const cli = meow(`
  Usage
    $ badtaste

  Options
    --setup Setup vk and google music login credentials
    --player mpd or node
`, {
  pkg: '../package.json'
});


setupCredentials(cli.flags.setup)
  .then(() => {
    const screen = tui();
    const main = new MainController(screen);

    const player = cli.flags.player === 'mpd' ? new MpdPlayer() : new NodePlayer();
    player.setOnNextSongCallback(() => store.dispatch(moveNext()));

    exitHook(player.killPlayer.bind(player));

    storage.on(PAUSE, () => player.pause());
    storage.on(PLAY, url => player.play(url));

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
