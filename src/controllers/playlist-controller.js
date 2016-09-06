import React from 'react';

import { listStylesheet } from '../tui/components/list';
import { connect } from 'react-redux';

import storage, {
  ADD_TO_PROFILE,
  MOVE_TO_PLAYING,
  LOCAL_SEARCH,
  UPDATE_RIGHT_PANE_ITEM,
} from '../storage';

import _ from 'lodash';
import { prompt } from '../tui/vk-prompts';

import {
  setCurrentIndex,
  filterPlaylist
} from '../actions/playlist-actions';

import {
  vkAddToProfile,
  vkAddOnTop
} from '../actions/dialogs-actions';

const mapStateToProps = ({ playlist }) => ({ playlist });
const mapDispatchToProps = { setCurrentIndex, filterPlaylist, vkAddOnTop, vkAddToProfile };

export default connect(mapStateToProps, mapDispatchToProps)(React.createClass({
  componentWillMount() {
    storage.on(MOVE_TO_PLAYING, () => {
      const { playlist: { currentIndex } } = this.props;
      this.box.select(currentIndex);
    });

    storage.on(LOCAL_SEARCH, () => {
      const { screen, filterPlaylist } = this.props;

      prompt(screen, 'Search', '')
        .then(query => filterPlaylist(query))
        .catch(err => Logger.error(err.stack || err));
    });

    storage.on(ADD_TO_PROFILE, () => {
      const { playlist: { playlist }, vkAddOnTop, vkAddToProfile } = this.props;

      const selected = playlist[this.box.selected];
      const listEl = this.box.items[this.box.selected];

      if (selected.isAdded) {
        vkAddOnTop({ selected, listEl });
      } else {
        vkAddToProfile({ selected, listEl });
      }
    });

    storage.on(UPDATE_RIGHT_PANE_ITEM, ({ item, text}) => {
      this.box.setItem(item, text);
    });
  },
  setRightBox(box) {
    const { setCurrentIndex, setRightBox } = this.props;

    this.box = box;
    this.box.on('select', (item, index) => {
      setCurrentIndex(index);
    });

    setRightBox(box);
  },
  focus() {
    this.box.focus();
  },
  render() {
    const { playlist: { playlist } } = this.props;
    const items = playlist && playlist.length > 0 ? _.pluck(playlist, 'trackTitleFull') : ['{bold}Loading{/bold}, please wait'];

    return (
      <list
        {...listStylesheet}
        ref={this.setRightBox}
        items={items} />
    );
  }
}));
