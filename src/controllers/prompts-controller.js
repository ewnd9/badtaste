import React from 'react';
import { connect } from 'react-redux';

import EmptyView from './empty-view/empty-view';

import { NextPromptRedux } from './prompt/prompt';
import { openGmAlbumsSearchResultModal } from '../actions/modals-actions';
import { fetchSearchAudio } from '../actions/vk-actions';

import {
  resetPrompts,
  GM_ALBUMS_SEARCH_PROMPT,
  VK_SEARCH_PROMPT,
  VK_NEW_LINK_PROMPT,
  VK_NEW_WALL_PROMPT
} from '../actions/prompt-actions';

const prompts = {
  [GM_ALBUMS_SEARCH_PROMPT]: NextPromptRedux('Google Music', 'Search', openGmAlbumsSearchResultModal),
  [VK_SEARCH_PROMPT]: NextPromptRedux('VK', 'Search', fetchSearchAudio),
  [VK_NEW_LINK_PROMPT]: require('./prompt/vk-new-link-prompt').default,
  [VK_NEW_WALL_PROMPT]: require('./prompt/vk-new-wall-prompt').default
};

const mapStateToProps = ({ prompts }) => ({ prompts });
const mapDispatchToProps = { resetPrompts };

const Prompt = React.createClass({
  render() {
    const { prompts: { prompt }, resetPrompts } = this.props;

    Logger.info('prompt', prompt, typeof prompts[prompt]);

    if (prompt === null) {
      return (<EmptyView />);
    } else if (prompts[prompt]) {
      return React.createElement(prompts[prompt], { resetPrompts });
    } else {
      throw new Error('unknown prompt', prompt);
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Prompt);
