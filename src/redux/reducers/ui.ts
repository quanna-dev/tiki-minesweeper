import { createReducer } from 'deox';

import { uiActions } from '@/redux/actions';
import { getDeviceType } from '@/utils/functions';

export interface IUIState {
  device: {
    type: string;
    width: number;
  };
}

const initialState: IUIState = {
  device: {
    type: getDeviceType(),
    width: window.innerWidth,
  },
};

const uiReducer = createReducer(initialState, (handleAction) => [
  handleAction(uiActions.setDevice, (state, { payload }) => ({
    ...state,
    device: {
      type: getDeviceType(),
      width: payload.deviceWidth,
    },
  })),
]);

export default uiReducer;
