import { navigate } from '@reach/router';

import { EGameLevel, TMineCoordinate } from '@/common-types/common.d';

import { TGetMinesParams } from '@/services/tiki-minesweeper';
import { getArrayFrom0To, beautifiedTimer } from '@/utils/functions';

import { Paths } from '@/pages/routers';

import { TCell, TCellInformation } from './Game.types';

export const isValidLevel = (level: string): boolean => {
  const validLevels: string[] = [EGameLevel.BEGINNER, EGameLevel.ADVANTAGE];
  const levelIsValid = validLevels.includes(level);

  return levelIsValid;
};

export const getLevelParams = (level: EGameLevel): TGetMinesParams => {
  const params = {
    [EGameLevel.BEGINNER]: { size: 9, mines: 10 },
    [EGameLevel.ADVANTAGE]: { size: 16, mines: 40 },
  };

  return params[level];
};

export const getCellsAround = (cells: TCell[], targetCell: TCell): (TCell | TCellInformation)[] => {
  return cells.filter((cell) => {
    const topLeftCell = cell.x === targetCell.x - 1 && cell.y === targetCell.y - 1;
    const topCell = cell.x === targetCell.x - 1 && cell.y === targetCell.y;
    const topRightCell = cell.x === targetCell.x - 1 && cell.y === targetCell.y + 1;
    const leftCell = cell.x === targetCell.x && cell.y === targetCell.y - 1;
    const rightCell = cell.x === targetCell.x && cell.y === targetCell.y + 1;
    const bottomLeftCell = cell.x === targetCell.x + 1 && cell.y === targetCell.y - 1;
    const bottomCell = cell.x === targetCell.x + 1 && cell.y === targetCell.y;
    const bottomRightCell = cell.x === targetCell.x + 1 && cell.y === targetCell.y + 1;
    const isCellAround =
      topLeftCell ||
      topCell ||
      topRightCell ||
      leftCell ||
      rightCell ||
      bottomLeftCell ||
      bottomCell ||
      bottomRightCell;
    return isCellAround;
  });
};

export const getGrid = (mines: TMineCoordinate[], level: EGameLevel): TCellInformation[] => {
  const { size } = getLevelParams(level);
  const slotRows = getArrayFrom0To(size);
  const coordinateCells = slotRows.map((row) => {
    const slotCells = getArrayFrom0To(size);
    return slotCells.map((cell) => ({ x: cell, y: row }));
  });
  const flatenCoordinateCells = coordinateCells.reduce((result, row) => [...result, ...row], []);
  const gridDetectedMines = flatenCoordinateCells.map((cell) => {
    const isMine = !!mines.find((mine) => mine.x === cell.x && mine.y === cell.y);
    return { ...cell, id: `${cell.x}-${cell.y}`, isMine, isOpen: false, flag: false, focusing: false };
  });
  const gridHasCellsAround = gridDetectedMines.map((cell) => {
    const cellsAround = getCellsAround(gridDetectedMines, cell);
    return { ...cell, cellsAround };
  });
  return gridHasCellsAround;
};

export const convertTimeToString = (time: number, totalCharacter: number): string => {
  const numberOfCharacters = time.toString().length;
  const numberOfAdditionalZeros = totalCharacter - numberOfCharacters;
  const additionalZeros = getArrayFrom0To(numberOfAdditionalZeros)
    .map(() => '0')
    .join('');
  return `${additionalZeros}${time}`;
};

export const goToHomePage = (): Promise<void> => navigate(Paths.Welcome);

export const restartGame = (): void => window.location.reload();

export const convertTimeToHHMMSS = (timeAsString: string): string => {
  const timeAsNumber = +timeAsString;
  const hours = ((timeAsNumber - (timeAsNumber % 3600)) / 3600) % 60;
  const minutes = ((timeAsNumber - (timeAsNumber % 60)) / 60) % 60;
  const seconds = timeAsNumber % 60;
  return `${beautifiedTimer(hours)}:${beautifiedTimer(minutes)}:${beautifiedTimer(seconds)}`;
};
