import { createReducer } from 'deox';

import { TGetMinesResponse } from '@/services/tiki-minesweeper/mines-controller';
import { getMinesAction } from '@/redux/actions';
import { getMinesUpdateState } from './get-mines';

export type TMinesControllerState = {
  getMinesResponse?: TGetMinesResponse;
};

const initialState: TMinesControllerState = {
  getMinesResponse: undefined,
};

const MinesControllerReducer = createReducer(initialState, (handleAction) => [
  handleAction(getMinesAction.success, getMinesUpdateState),
]);

export default MinesControllerReducer;
