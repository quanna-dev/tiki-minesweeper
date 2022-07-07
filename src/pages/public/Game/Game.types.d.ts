export type TGameProps = unknown;

export type TCell = {
  id: string;
  isMine: boolean;
  isOpen: boolean;
  x: number;
  y: number;
};

export type TCellInformation = TCell & {
  cellsAround: TCell[];
};
