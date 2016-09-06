import React from 'react';
import { connect } from 'react-redux';

import storage from '../../storage';
import SelectList from '../select-list/select-list';

import { resetModals } from '../../actions/modals-actions';
import { fetchAlbum } from '../../actions/gm-actions';
import { showPrompt, GM_ALBUMS_SEARCH_PROMPT } from '../../actions/prompt-actions';

const { gmLinks } = storage.data; // con be done later as part of redux state
const labels = gmLinks.map(link => link.name);

const mapStateToProps = null;
const mapDispatchToProps = { resetModals, showPrompt, fetchAlbum };

const Modal = React.createClass({
  componentWillMount() {
    this.items = ['> Search'].concat(labels);
  },
  onComplete(index) {
    const { resetModals, fetchAlbum, showPrompt } = this.props;
    resetModals();

    if (index === 0) {
      showPrompt(GM_ALBUMS_SEARCH_PROMPT);
    } else if (typeof index !== 'undefined') {
      fetchAlbum(gmLinks[index - 1].data.albumId);
    }
  },
  render() {
    const { screen } = this.props;

    return (
      <SelectList
        screen={screen}
        onComplete={this.onComplete}
        items={this.items}
      />
    );
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
