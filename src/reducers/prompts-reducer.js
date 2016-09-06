import { createReducer } from './utils';

import {
  SHOW_PROMPT,
  RESET_PROMPTS
} from '../actions/prompt-actions';

export default createReducer({
  prompt: null
}, {
  [SHOW_PROMPT](state, action) {
    return {
      ...state,
      prompt: action.prompt
    };
  },
  [RESET_PROMPTS](state) {
    return {
      ...state,
      prompt: null
    };
  }
});
