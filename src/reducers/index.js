import { combineReducers } from 'redux';

import playlist from './playlist-reducer';
import dialogs from './dialogs-reducer';
import modals from './modals-reducer';

const rootReducer = combineReducers({
  playlist,
  dialogs,
  modals
});

export default rootReducer;
