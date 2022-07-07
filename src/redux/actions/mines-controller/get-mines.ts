import { createActionCreator } from 'deox';

import { TGetMinesMaterials, TGetMinesResponse } from '@/services/tiki-minesweeper/mines-controller/get-mines';

// CONSTANTS

export enum EGetMinesAction {
  GET_MINES = 'GET_MINES',
  GET_MINES_REQUEST = 'GET_MINES_REQUEST',
  GET_MINES_SUCCESS = 'GET_MINES_SUCCESS',
  GET_MINES_FAILED = 'GET_MINES_FAILED',
}

// TYPES

export type TGetMinesRequest = {
  type: EGetMinesAction.GET_MINES_REQUEST;
  payload: {
    materials: TGetMinesMaterials;
    successCallback?: (response: TGetMinesResponse) => void;
    failedCallback?: (err: unknown) => void;
  };
};

export type TGetMinesSuccess = {
  type: EGetMinesAction.GET_MINES_SUCCESS;
  payload: { response: TGetMinesResponse };
};

export type TGetMinesFailed = { type: EGetMinesAction.GET_MINES_FAILED };

// FUNCTION

export const getMinesAction = {
  request: createActionCreator(
    EGetMinesAction.GET_MINES_REQUEST,
    (resolve) =>
      (
        materials: TGetMinesMaterials,
        successCallback?: (response: TGetMinesResponse) => void,
        failedCallback?: (err: unknown) => void,
      ): TGetMinesRequest =>
        resolve({ materials, successCallback, failedCallback }),
  ),
  success: createActionCreator(
    EGetMinesAction.GET_MINES_SUCCESS,
    (resolve) =>
      (response: TGetMinesResponse): TGetMinesSuccess =>
        resolve({ response }),
  ),
  failure: createActionCreator(
    EGetMinesAction.GET_MINES_FAILED,
    (resolve) =>
      (error: unknown): TGetMinesFailed =>
        resolve({ error }),
  ),
};
