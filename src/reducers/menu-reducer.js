import { createReducer } from './utils';

import {
  ADD_VK_ITEM,
  ADD_GM_ITEM
} from '../actions/menu-actions';

export default createReducer({
  vkLinks: [],
  gmLinks: []
}, {
  [ADD_VK_ITEM](state, { item }) {
    return {
      ...state,
      vkLinks: [item, ...state.vkLinks]
    };
  },
  [ADD_GM_ITEM](state, { item }) {
    return {
      ...state,
      gmLinks: [item, ...state.gmLinks]
    };
  }
});
