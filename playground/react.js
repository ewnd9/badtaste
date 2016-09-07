import React from 'react';
import blessed from 'blessed';
import { render } from '@ewnd9/react-blessed';

import { styles as textboxStyles } from '../src/tui/components/textbox';

const Logger = console;

const App = React.createClass({
  setMessageRef(msg) {
    msg.focus();
  },
  render() {
    return (
      <element>
        <textbox ref={this.setMessageRef} {...textboxStyles} />
      </element>
    );
  }
});

const screen = blessed.screen({
  smartCSR: true,
  title: 'react-blessed hello world'
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

const component = render(<App />, screen);
