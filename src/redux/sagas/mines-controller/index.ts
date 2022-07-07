import { all, takeLatest } from 'redux-saga/effects';

import { getMinesAction } from '@/redux/actions';

import { getMinesSaga } from './get-mines';

export default function* root(): Generator {
  yield all([takeLatest(getMinesAction.request.type, getMinesSaga)]);
}
