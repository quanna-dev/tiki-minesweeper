import { ActionType } from 'deox';
import { call, put } from 'redux-saga/effects';

import { getMinesAction } from '@/redux/actions';
import { getMines, TGetMinesResponse } from '@/services/tiki-minesweeper';

// FUNCTION

export function* getMinesSaga(action: ActionType<typeof getMinesAction.request>): Generator {
  const { materials, successCallback, failedCallback } = action.payload;
  try {
    const response = yield call(getMines, materials);
    const getMinesResponse: TGetMinesResponse = response as TGetMinesResponse;
    yield put(getMinesAction.success(getMinesResponse));
    successCallback?.(getMinesResponse);
  } catch (err) {
    yield put(getMinesAction.failure(err));
    failedCallback?.(err);
  }
}
