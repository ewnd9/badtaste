import React from 'react';
import { connect } from 'react-redux';

import SelectList from '../select-list/select-list';

import { resetModals } from '../../actions/modals-actions';
import { fetchGroupAudio } from '../../actions/vk-actions';

const mapStateToProps = null;
const mapDispatchToProps = { resetModals, fetchGroupAudio };

const Modal = React.createClass({
  onComplete(index) {
    const { resetModals, fetchGroupAudio, props: { albums } } = this.props;
    resetModals();

    const album = albums[index];
    fetchGroupAudio(album.owner_id, album.album_id);
  },
  render() {
    const { screen, props: { albums } } = this.props;
    const items = albums.map(album => album.title);

    return (
      <SelectList
        screen={screen}
        onComplete={this.onComplete}
        items={items} />
    );
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
