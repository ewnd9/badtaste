import React from 'react';
import { stylesheet as listStyle } from '../tui/components/list';

import _ from 'lodash';

import vkMenu from '../tui/helpers/vk-menu';
import gmMenu from '../tui/helpers/gm-menu';
import fsMenu from '../tui/helpers/fs-menu';

export default React.createClass({
  componentWillMount() {
    const { screen } = this.props;

    this.menu = _.flatten([]
      .concat(vkMenu(screen))
      .concat(gmMenu(screen))
      .concat(fsMenu(screen)));
  },
  focus() {
    this.box.focus();
  },
  setLeftBox(box) {
    this.box = box;
    this.box.on('select', this.onSelect);

    this.onSelect(null, 0);
  },
  onSelect(item, index) {
    this.menu[index].fn();
  },
  render() {
    return (
      <list
        {...listStyle}
        ref={this.setLeftBox}
        left={0}
        width="30%"
        items={_.pluck(this.menu, 'name')} />
    );
  }
});
