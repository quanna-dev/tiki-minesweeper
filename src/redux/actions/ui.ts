import { createActionCreator } from 'deox';

// CONSTANTS
export enum EUIAction {
  SET_DEVICE = 'SET_DEVICE',
  RESET_ACTION_STATUS = 'RESET_ACTION_STATUS',
}

// TYPES
export type TSetDevice = { type: EUIAction.SET_DEVICE; payload: { deviceWidth: number } };
export type TResetActionStatus = { type: EUIAction.RESET_ACTION_STATUS };

// FUNCTION

export const uiActions = {
  setDevice: createActionCreator(
    EUIAction.SET_DEVICE,
    (resolve) =>
      (deviceWidth: number): TSetDevice =>
        resolve({ deviceWidth }),
  ),
  resetActionStatus: createActionCreator(
    EUIAction.RESET_ACTION_STATUS,
    (resolve) =>
      (actionName: string): TResetActionStatus =>
        resolve({ actionName: actionName.replace('_REQUEST', '') }),
  ),
};
