import { all, fork } from 'redux-saga/effects';

import minesControllerSaga from './mines-controller';

const rootSaga = function* root(): Generator {
  yield all([fork(minesControllerSaga)]);
};

export default rootSaga;
