import React from 'react';
import { connect } from 'react-redux';

import { stylesheet as messageStyle } from '../tui/components/message';

import { NextPromptRedux } from './prompt/prompt';
import { openGmAlbumsSearchResultModal } from '../actions/modals-actions';

import {
  resetPrompts,
  GM_ALBUMS_SEARCH_PROMPT
} from '../actions/prompt-actions';

const prompts = {
  [GM_ALBUMS_SEARCH_PROMPT]: () => NextPromptRedux('Google Music', 'Search', openGmAlbumsSearchResultModal)
};

const mapStateToProps = ({ prompts }) => ({ prompts });
const mapDispatchToProps = { resetPrompts };

const Prompt = React.createClass({
  render() {
    const { prompts: { prompt }, resetPrompts } = this.props;

    Logger.info('prompt', prompt, typeof prompts[prompt]);

    if (prompt === null) {
      return (<message {...messageStyle} label="{blue-fg}Info{/blue-fg}" />);
    } else if (prompts[prompt]) {
      return React.createElement(prompts[prompt]());
    } else {
      throw new Error('unknown prompt', prompt);
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Prompt);
