import React from 'react';
import { connect } from 'react-redux';

import storage, { RENDER_LEFT_PANE } from '../../storage';
import SelectList from '../select-list/select-list';

import { resetModals } from '../../actions/modals-actions';
import { fetchAlbum } from '../../actions/gm-actions';

const mapStateToProps = null;
const mapDispatchToProps = { resetModals, fetchAlbum };

const Modal = React.createClass({
  onComplete(index) {
    const { props: { albums }, resetModals, fetchAlbum } = this.props;
    resetModals();

    const labels = albums.map(entry => `${entry.album.artist} - ${entry.album.name}`);
    const albumId = albums[index].album.albumId;

    storage.data.gmLinks.unshift({ // insert at the beginning
      name: labels[index],
      data: { albumId }
    });
    storage.save();

    fetchAlbum(albumId);
    storage.emit(RENDER_LEFT_PANE);
  },
  render() {
    const { screen, props: { albums } } = this.props;
    const labels = albums.map(entry => `${entry.album.artist} - ${entry.album.name}`);

    return (
      <SelectList
        screen={screen}
        onComplete={this.onComplete}
        items={labels}
      />
    );
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
