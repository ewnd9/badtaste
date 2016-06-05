import { VK_SEARCH_MODAL, RESET_MODALS } from '../actions/modals-actions';

function modalsReducer(state = {
  modal: null,
  props: null
}, action) {
  switch (action.type) {
    case VK_SEARCH_MODAL:
      return {
        ...state,
        modal: VK_SEARCH_MODAL
      };
    case RESET_MODALS:
      return {
        ...state,
        modal: null
      };
    default:
      return state;
  }
}

export default modalsReducer;
