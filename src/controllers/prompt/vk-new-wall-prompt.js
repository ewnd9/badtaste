import React from 'react';
import { connect } from 'react-redux';

import storage, { RENDER_LEFT_PANE } from '../../storage';
import { UrlPrompt } from './prompt';

import { resetPrompts } from '../../actions/prompt-actions';
import { fetchAudioByUrl } from '../../actions/vk-actions';
import { addVkItem } from '../../actions/menu-actions';

import { getOwnerIdByUrl } from '../../api/vk-api';

const mapStateToProps = null;
const mapDispatchToProps = { resetPrompts, fetchAudioByUrl, addVkItem };

const VkPrompt = React.createClass({
  onComplete({ url, name }) {
    const { resetPrompts, fetchAudioByUrl, addVkItem } = this.props;
    resetPrompts();

    getOwnerIdByUrl(url)
      .then(id => {
        addVkItem({ name, data: { type: 'full-wall', id } });
        fetchAudioByUrl(url);

        storage.emit(RENDER_LEFT_PANE);
      }, err => {
        Logger.error(err);
      });
  },
  render() {
    const urlsExamples = [
      'Enter url like:',
      '',
      'vk.com/audios1?album_id=1',
      'vk.com/wall1',
      'vk.com/user1'
    ];

    return (
      <UrlPrompt
        label="VK New Wall"
        urlQuestion={urlsExamples}
        nameQuestion={['Enter alias for menu']}
        onComplete={this.onComplete} />
    );
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(VkPrompt);
