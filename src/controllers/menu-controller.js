import React from 'react';

import { listStylesheet } from '../tui/components/list';
import { connect } from 'react-redux';

import _ from 'lodash';

// import storage, { RENDER_LEFT_PANE } from '../storage';

import vkMenu from '../tui/helpers/vk-menu';
import gmMenu from '../tui/helpers/gm-menu';
import fsMenu from '../tui/helpers/fs-menu';

const mapStateToProps = ({ menu }) => ({ menu });
const mapDispatchToProps = {  };

const Menu = React.createClass({
  focus() {
    this.box.focus();
  },
  setLeftBox(box) {
    const { setLeftBox } = this.props;

    this.box = box;
    this.box.on('select', this.onSelect);

    this.onSelect(null, 0);
    setLeftBox(box);
  },
  getMenu() {
    const { screen, menu: { vkLinks, gmLinks, fsLinks } } = this.props;

    return _.flatten(
      [].concat(vkMenu(screen, vkLinks))
        .concat(gmMenu(screen, gmLinks))
        .concat(fsMenu(screen, fsLinks))
    );
  },
  onSelect(item, index) {
    const menu = this.getMenu();
    menu[index].fn();
  },
  render() {
    const menu = this.getMenu();

    return (
      <list
        {...listStylesheet}
        ref={this.setLeftBox}
        items={_.pluck(menu, 'name')} />
    );
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
