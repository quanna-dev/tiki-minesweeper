import { TMineCoordinate } from '@/common-types/common';
import TikiMinesweeperService from '@/services/tiki-minesweeper';

// TYPES

export type TGetMinesParams = {
  size: number;
  mines: number;
};

export type TGetMinesMaterials = {
  params?: TGetMinesParams;
};

export type TGetMinesResponse = {
  msg: string;
  data: TMineCoordinate[];
};

// FUNCTION

export const getMines = async ({ params }: TGetMinesMaterials): Promise<TGetMinesResponse> => {
  const response = await TikiMinesweeperService.get(`/getMines`, { params });
  return response.data;
};
