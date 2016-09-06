import React from 'react';
import blessed from 'blessed';
import { render } from '@ewnd9/react-blessed';

import { stylesheet as listStyle } from '../src/tui/components/list';
import { stylesheet as lineStyle } from '../src/tui/components/line';

import { stylesheet as messageStyle } from '../src/tui/components/message';

const Logger = console;

const App = React.createClass({
  setMessageRef(msg) {
    msg.display('hello world', 1, function(err) {
      if (err) {
        Logger.error(err);
      }
    });
  },
  render() {
    return (
      <element>
        <list {...listStyle} left={0} width="30%" items={['Loading']} />
        <line {...lineStyle} left={1} width="30%-3" />
        <list {...listStyle} left="30%" width="70%" items={['{bold}Loading{/bold}, please wait']} />
        <line {...lineStyle} left="30%+1" width="70%-3" />
        <message ref={this.setMessageRef} {...messageStyle} label="{blue-fg}Info{/blue-fg}" />
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
