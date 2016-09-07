import React from 'react';

import { connect } from 'react-redux';
import EmptyView from './empty-view/empty-view';

import {
  VK_LINKS_MODAL,
  VK_USER_PLAYLISTS_MODAL,
  GM_LINKS_MODAL,
  GM_ALBUMS_SEARCH_RESULT_MODAL
} from '../actions/modals-actions';

const mapStateToProps = ({ modals }) => ({ modals });
const mapDispatchToProps = {  };

const modals = {
  [GM_LINKS_MODAL]: require('./modals/gm-links-modal').default,
  [GM_ALBUMS_SEARCH_RESULT_MODAL]: require('./modals/gm-search-result-modal').default,
  [VK_USER_PLAYLISTS_MODAL]: require('./modals/vk-user-playlists-modal').default,
  [VK_LINKS_MODAL]: require('./modals/vk-links-modal').default
};

const Modals = React.createClass({
  render() {
    const { screen, modals: { modal, props } } = this.props;
    Logger.info('modal', modal, typeof modals[modal]);

    if (modal === null) {
      return (<EmptyView />);
    } else if (modals[modal]) {
      return React.createElement(modals[modal], { screen, props });
    } else {
      throw new Error('unknown modal', modal);
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Modals);
