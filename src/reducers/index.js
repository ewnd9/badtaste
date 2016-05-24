import { combineReducers } from 'redux';

import playlist from './playlist-reducer';
import dialogs from './dialogs-reducer';

const rootReducer = combineReducers({
  playlist,
  dialogs
});

export default rootReducer;
