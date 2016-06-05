import storage, {
  SHOW_HELP,
  SWITCH_PANE,
  FOCUS_LEFT_PANE,
  FOCUS_RIGHT_PANE
} from '../storage';

import HelpBox from '../tui/help-box';

import List from '../tui/components/list';
import Line from '../tui/components/line';

import MenuController from './menu-controller';
import PlaylistController from './playlist-controller';

import DialogsController from './dialogs-controller';
import ModalsController from './modals-controller';

export default MainController;

function MainController(screen) {
  this.screen = screen;
  this.dialogsController = new DialogsController(screen);
  this.modalsController = new ModalsController(screen);

  this.menuPane = {
    box: List(screen, {
      left: 0,
      width: '30%',
      items: ['Loading']
    }),
    line: Line(screen, { left: 1, width: '30%-3' })
  };

  this.playlistPane = {
    box: List(screen, {
      left: '30%',
      width: '70%',
      items: ['{bold}Loading{/bold}, please wait']
    }),
    line: Line(screen, { left: '30%+1', width: '70%-3' })
  };

  this.menuController = new MenuController(this.screen, this.menuPane.box);
  this.playlistController = new PlaylistController(this.screen, this.playlistPane.box);

  storage.on(SHOW_HELP, () => HelpBox(this.screen));
  storage.on(SWITCH_PANE, this.switchPanesFocus.bind(this));

  storage.on(FOCUS_LEFT_PANE, this.focusPane.bind(this, this.menuPane, this.playlistPane));
  storage.on(FOCUS_RIGHT_PANE, this.focusPane.bind(this, this.playlistPane, this.menuPane));

  storage.emit(FOCUS_RIGHT_PANE);
}

MainController.prototype.focusPane = function(pane1, pane2) {
  pane1.line.show();
  pane1.box.focus();

  pane2.line.hide();
  this.screen.render();
};

MainController.prototype.switchPanesFocus = function() {
  if (this.menuPane.line.hidden) {
    this.focusPane(this.menuPane, this.playlistPane);
  } else {
    this.focusPane(this.playlistPane, this.menuPane);
  }
};
