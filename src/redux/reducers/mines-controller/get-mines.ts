import { TMinesControllerState } from '@/redux/reducers/mines-controller';
import { TGetMinesSuccess } from '@/redux/actions/mines-controller';

export const getMinesUpdateState = (state: TMinesControllerState, action: TGetMinesSuccess): TMinesControllerState => ({
  ...state,
  getMinesResponse: action.payload.response,
});
