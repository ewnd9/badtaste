import React from 'react';

import { Provider } from 'react-redux';
import { render } from '@ewnd9/react-blessed';

import storage, {
  store,
  SHOW_HELP,
  SWITCH_PANE,
  FOCUS_LEFT_PANE,
  FOCUS_RIGHT_PANE
} from '../storage';

import HelpBox from '../tui/help-box';

import { stylesheet as messageStyle } from '../tui/components/message';

import { stylesheet as listStyle } from '../tui/components/list';
import { stylesheet as lineStyle } from '../tui/components/line';

import Menu from './menu-controller';
import Playlist from './playlist-controller';

import DialogsController from './dialogs-controller';
import ModalsController from './modals-controller';

const App = React.createClass({
  componentWillMount() {
    this.menuPane = {};
    this.playlistPane = {};
  },
  componentDidMount() {
    const { screen } = this.props;

    this.dialogsController = new DialogsController(screen);
    this.modalsController = new ModalsController(screen);

    storage.on(SHOW_HELP, () => HelpBox(screen));
    storage.on(SWITCH_PANE, this.switchPanesFocus);

    storage.on(FOCUS_LEFT_PANE, () => this.focusPane(this.menuPane, this.playlistPane));
    storage.on(FOCUS_RIGHT_PANE, () => this.focusPane(this.playlistPane, this.menuPane));

    storage.emit(FOCUS_RIGHT_PANE);
  },
  focusPane(pane1, pane2) {
    const { screen } = this.props;

    pane1.line.show();

    if (pane1.box) {
      pane1.box.focus();
    }

    pane2.line.hide();
    screen.render();
  },
  switchPanesFocus() {
    if (this.menuPane.line.hidden) {
      this.focusPane(this.menuPane, this.playlistPane);
    } else {
      this.focusPane(this.playlistPane, this.menuPane);
    }
  },
  setMessageRef(msg) {
    msg.display('hello world', 1, function(err) {
      if (err) {
        Logger.error(err);
      }
    });
  },
  setLeftLine(line) {
    this.menuPane.line = line;
  },
  setLeftBox(box) {
    this.menuPane.box = box;
  },
  setRightLine(line) {
    this.playlistPane.line = line;
  },
  setRightBox(box) {
    this.playlistPane.box = box;
  },
  render() {
    const { screen } = this.props;

    // return (
    //   <Provider store={store}>
    //     <Playlist screen={screen} setRightBox={this.setRightBox} />
    //
    //   </Provider>
    // );
    return (
      <Provider store={store}>
        <element>
          <Menu screen={screen} ref={this.setLeftBox} />
          <line {...lineStyle} ref={this.setLeftLine} left={1} width="30%-3" />

          <box
            {...listStyle}
            left="30%"
            width="70%">

            <Playlist screen={screen} setRightBox={this.setRightBox} />

          </box>

          <line {...lineStyle} ref={this.setRightLine} left="30%+1" width="70%-3" />

          <message ref={this.setMessageRef} {...messageStyle} label="{blue-fg}Info{/blue-fg}" />
        </element>
      </Provider>
    );
  }
});

export default MainController;

function MainController(screen) {
  render(<App screen={screen} />, screen);
}
