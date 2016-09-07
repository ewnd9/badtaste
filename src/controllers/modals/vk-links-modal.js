import React from 'react';
import { connect } from 'react-redux';

import storage from '../../storage';
import SelectList from '../select-list/select-list';

import { resetModals } from '../../actions/modals-actions';

import {
  fetchAudioByUrl,
  fetchGroupAudio,
  fetchWallAudio,
  fetchGroupWall
} from '../../actions/vk-actions';

import {
  showPrompt,
  VK_NEW_LINK_PROMPT,
  VK_NEW_WALL_PROMPT
} from '../../actions/prompt-actions';

const { vkLinks } = storage.data; // con be done later as part of redux state
const labels = vkLinks.map(link => link.name);
// const labels = [];

const mapStateToProps = null;
const mapDispatchToProps = {
  resetModals,

  showPrompt,

  fetchAudioByUrl,
  fetchGroupAudio,
  fetchWallAudio,
  fetchGroupWall
};

const Modal = React.createClass({
  componentWillMount() {
    this.items = [
      '> Search (All Audio from a Playlist or a Wall Post)',
      '> Wall (All Posts From a User or a Public Page or a Group)'
    ].concat(labels);
  },
  onComplete(index) {
    const {
      resetModals,

      showPrompt,

      fetchAudioByUrl,
      fetchGroupAudio,
      fetchWallAudio,
      fetchGroupWall
    } = this.props;

    resetModals();

    if (index === 0) {
      showPrompt(VK_NEW_LINK_PROMPT);
    } else if (index === 1) {
      showPrompt(VK_NEW_WALL_PROMPT);
    } else {
      const data = vkLinks[index - 2].data;

      if (data.url) {
        fetchAudioByUrl(data.url);
      } else if (data.type === 'audio') {
        fetchGroupAudio(data.owner_id, data.album_id);
      } else if (data.type === 'wall') {
        fetchWallAudio(data.id);
      } else if (data.type === 'full-wall') {
        fetchGroupWall(data.id);
      }
    }
  },
  render() {
    const { screen } = this.props;

    return (
      <SelectList
        screen={screen}
        onComplete={this.onComplete}
        items={this.items} />
    );
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
