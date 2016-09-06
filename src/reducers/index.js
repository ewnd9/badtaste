import { combineReducers } from 'redux';

import playlist from './playlist-reducer';
import dialogs from './dialogs-reducer';
import modals from './modals-reducer';
import prompts from './prompts-reducer';

const rootReducer = combineReducers({
  playlist,
  dialogs,
  modals,
  prompts
});

export default rootReducer;
