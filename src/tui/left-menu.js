import _ from 'lodash';

import vkMenu from './helpers/vk-menu';
import gmMenu from './helpers/gm-menu';
import fsMenu from './helpers/fs-menu';

import storage, { RENDER_LEFT_PANE } from './../storage';

export default (screen, leftPane) => {
  let leftMenu;

  const renderLeftPane = () => {
    let leftMenuRaw = vkMenu(screen, leftPane)
      .concat(gmMenu(screen, leftPane))
      .concat(fsMenu(screen, leftPane));

    leftMenu = _.flatten(leftMenuRaw);
    leftPane.setItems(_.pluck(leftMenu, 'name'));

    leftPane.focus();
    screen.render();
  };

  renderLeftPane();
  storage.on(RENDER_LEFT_PANE, renderLeftPane);

  const selectLeftPane = (item, index) => {
    leftMenu[index].fn();
  };

  selectLeftPane(null, 0);
  leftPane.on('select', selectLeftPane);
};
