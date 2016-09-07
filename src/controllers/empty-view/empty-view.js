import React from 'react';
import { stylesheet as messageStyle } from '../../tui/components/message';

export default React.createClass({
  render() {
    return (
      <message {...messageStyle} label="{blue-fg}Info{/blue-fg}" />
    );
  }
});
