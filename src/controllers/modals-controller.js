import { store } from '../storage';

import { VK_SEARCH_MODAL, resetModals } from '../actions/modals-actions';
import { fetchSearchAudio } from '../actions/vk-actions';

import { vkSearchPrompt } from '../tui/vk-prompts';

function ModalsController(screen) {
  this.screen = screen;
  this.modal = null;

  store.subscribe(() => {
    if (this.modal !== store.getState().modals.modal) {
      this.modal = store.getState().modals.modal;
      this.render(this.modal);
    }
  });
}

export default ModalsController;

ModalsController.prototype.render = function(modal) {
  if (modal === VK_SEARCH_MODAL) {
    vkSearchPrompt(this.screen) // can be done later as react component
      .then(query => {
        store.dispatch(resetModals());
        store.dispatch(fetchSearchAudio(query));
      });
  } else if (modal === null) {
    this.screen.render();
  }
};
