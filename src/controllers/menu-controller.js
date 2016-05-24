import _ from 'lodash';

import vkMenu from '../tui/helpers/vk-menu';
import gmMenu from '../tui/helpers/gm-menu';
import fsMenu from '../tui/helpers/fs-menu';

import storage, {
  RENDER_LEFT_PANE
} from '../storage';

export default MenuController;

function MenuController(screen, leftPane) {
  this.screen = screen;
  this.leftPane = leftPane;
  this.MenuController = null;

  this.render();
  storage.on(RENDER_LEFT_PANE, this.render.bind(this));

  this.leftPane.on('select', this.onSelect.bind(this));
  this.onSelect(null, 0);
}

MenuController.prototype.render = function() {
  const menu = []
    .concat(fsMenu(this.screen, this.leftPane))
    .concat(vkMenu(this.screen, this.leftPane))
    .concat(gmMenu(this.screen, this.leftPane));

  this.menu = _.flatten(menu);
  this.leftPane.setItems(_.pluck(this.menu, 'name'));

  this.leftPane.focus();
  this.screen.render();
};

MenuController.prototype.onSelect = function(item, index) {
  this.menu[index].fn();
};
