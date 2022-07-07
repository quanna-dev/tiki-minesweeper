export type TGameProps = unknown;

export type TCell = {
  id: string;
  isMine: boolean;
  isOpen: boolean;
  flag: boolean;
  x: number;
  y: number;
  focusing: boolean;
};

export type TCellInformation = TCell & {
  cellsAround: TCell[];
};
