import { combineReducers } from 'redux';

import { loadingReducer, errorReducer, successReducer } from './status';
import minesControllerReducer from './mines-controller';
import uiReducer from './ui';

const rootReducer = combineReducers({
  loadingReducer,
  errorReducer,
  successReducer,
  minesControllerReducer,
  uiReducer,
});

export default rootReducer;

export type TRootState = ReturnType<typeof rootReducer>;
