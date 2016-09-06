import React from 'react';
import { stylesheet as messageStyle } from '../tui/components/message';
import { connect } from 'react-redux';

import {
  VK_SEARCH_MODAL,
  VK_LINKS_MODAL,
  VK_NEW_LINK_MODAL,
  VK_NEW_WALL_MODAL,
  VK_USER_PLAYLISTS_MODAL,
  GM_LINKS_MODAL,
  GM_ALBUMS_SEARCH_RESULT_MODAL,
  openVkNewLinkModal,
  openVkNewWallModal,
  openGmAlbumsSearchResultModal,
  resetModals
} from '../actions/modals-actions';

const mapStateToProps = ({ modals }) => ({ modals });
const mapDispatchToProps = {  };

const modals = {
  [GM_LINKS_MODAL]: require('./modals/gm-links-modal').default,
  [GM_ALBUMS_SEARCH_RESULT_MODAL]: require('./modals/gm-search-result-modal').default,
  // [VK_SEARCH_MODAL]: this.renderVkSearchModal,
  // [VK_USER_PLAYLISTS_MODAL]: this.renderVkUserPlaylistsModal,
  // [VK_LINKS_MODAL]: this.renderVkLinksModal,
  // [VK_NEW_LINK_MODAL]: this.renderVkNewLinkModal,
  // [VK_NEW_WALL_MODAL]: this.renderVkNewWallModal
};

const Modals = React.createClass({
  render() {
    const { screen, modals: { modal, props } } = this.props;
    Logger.info('modal', modal, typeof modals[modal]);

    if (modal === null) {
      return (<message {...messageStyle} label="{blue-fg}Info{/blue-fg}" />);
    } else if (modals[modal]) {
      return React.createElement(modals[modal], { screen, props });
    } else {
      throw new Error('unknown modal', modal);
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Modals);

// import storage, { store, RENDER_LEFT_PANE } from '../storage';
// import SelectList from '../tui/select-list';
//
// import {
//   VK_SEARCH_MODAL,
//   VK_LINKS_MODAL,
//   VK_NEW_LINK_MODAL,
//   VK_NEW_WALL_MODAL,
//   VK_USER_PLAYLISTS_MODAL,
//   GM_LINKS_MODAL,
//   GM_ALBUMS_SEARCH_RESULT_MODAL,
//   openVkNewLinkModal,
//   openVkNewWallModal,
//   openGmAlbumsSearchResultModal,
//   resetModals
// } from '../actions/modals-actions';
//
// import {
//   fetchSearchAudio,
//   fetchAudioByUrl,
//   fetchGroupAudio,
//   fetchWallAudio,
//   fetchGroupWall
// } from '../actions/vk-actions';
//
// import {
//   fetchAlbum
// } from '../actions/gm-actions';
//
// import {
//   getOwnerIdByUrl
// } from '../api/vk-api';
//
// import {
//   prompt,
//   urlPrompt,
//   vkSearchPrompt
// } from '../tui/vk-prompts';
//
// ModalsController.prototype.renderVkSearchModal = function() {
//   vkSearchPrompt(this.screen) // can be done later as react component
//     .then(query => {
//       store.dispatch(resetModals());
//       store.dispatch(fetchSearchAudio(query));
//     });
// };
//
// ModalsController.prototype.renderVkUserPlaylistsModal = function(props) {
//   const { albums } = props;
//
//   SelectList(this.screen, albums.map(album => album.title))
//     .then(index => {
//       const album = albums[index];
//
//       store.dispatch(resetModals());
//       store.dispatch(fetchGroupAudio(album.owner_id, album.album_id));
//     });
// };
//
// ModalsController.prototype.renderVkLinksModal = function() {
//   const { vkLinks } = storage.data; // con be done later as part of redux state
//   const labels = vkLinks.map(link => link.name);
//
//   SelectList(this.screen, ['> Search', '> Wall'].concat(labels))
//     .then(index => {
//       store.dispatch(resetModals());
//
//       if (index === 0) {
//         store.dispatch(openVkNewLinkModal());
//       } else if (index === 1) {
//         store.dispatch(openVkNewWallModal());
//       } else {
//         const data = vkLinks[index - 2].data;
//
//         if (data.url) {
//           store.dispatch(fetchAudioByUrl(data.url));
//         } else if (data.type === 'audio') {
//           store.dispatch(fetchGroupAudio(data.owner_id, data.album_id));
//         } else if (data.type === 'wall') {
//           store.dispatch(fetchWallAudio(data.id));
//         } else if (data.type === 'full-wall') {
//           store.dispatch(fetchGroupWall(data.id));
//         }
//       }
//     }, () => Logger.info('SelectList closed by esc'));
// };
//
// ModalsController.prototype.renderVkNewLinkModal = function() {
//   const { vkLinks } = storage.data; // con be done later as part of redux state
//
//   const urlsExamples = [
//     'Enter url like:',
//     '',
//     'vk.com/audios1?album_id=1',
//     'vk.com/wall1',
//     'vk.com/user1'
//   ];
//
//   urlPrompt(this.screen, urlsExamples, 'Enter alias for menu')
//     .then(promptResult => {
//       store.dispatch(resetModals());
//
//       vkLinks.unshift({ // insert at the beginning
//         name: promptResult.name,
//         data: { url: promptResult.url }
//       });
//       storage.save();
//
//       storage.emit(RENDER_LEFT_PANE);
//       store.dispatch(fetchAudioByUrl(promptResult.url));
//     });
// };
//
// ModalsController.prototype.renderVkNewWallModal = function() {
//   const { vkLinks } = storage.data; // con be done later as part of redux state
//
//   const urlsExamples = [
//     'Enter url like:',
//     '',
//     'vk.com/audios1?album_id=1',
//     'vk.com/wall1',
//     'vk.com/user1'
//   ];
//
//   let promptResult;
//
//   urlPrompt(this.screen, urlsExamples, 'Enter alias for menu')
//     .then(_promptResult => {
//       promptResult = _promptResult;
//
//       store.dispatch(resetModals());
//       return getOwnerIdByUrl(promptResult.url); // need load indicator
//     })
//     .then(id => {
//       vkLinks.unshift({ // insert at the beginning
//         name: promptResult.name,
//         data: {
//           type: 'full-wall',
//           id: id
//         }
//       });
//
//       storage.save();
//
//       storage.emit(RENDER_LEFT_PANE);
//       store.dispatch(fetchAudioByUrl(promptResult.url));
//     });
// };
