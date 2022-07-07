import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { navigate, useParams } from '@reach/router';
import classNames from 'classnames';

import { EGameLevel } from '@/common-types/common.d';

import { TRootState } from '@/redux/reducers';
import { EGetMinesAction, getMinesAction, uiActions } from '@/redux/actions';

import { TGetMinesResponse } from '@/services/tiki-minesweeper';

import { Paths } from '@/pages/routers';
import LoadingFallback from '@/components/LoadingFallback';
import ActionModal from '@/components/ActionModal';
import { EButtonStyleType } from '@/components/Button';

import IconClock from '@/assets/icons/clock.png';

import {
  getLevelParams,
  isValidLevel,
  getGrid,
  convertTimeToString,
  goToHomePage,
  restartGame,
  convertTimeToHHMMSS,
  getCellsAround,
} from './Game.functions';
import { TCellInformation, TGameProps } from './Game.types.d';
import './Game.scss';

const Game: React.FC<TGameProps> = () => {
  const { level } = useParams();
  const dispatch = useDispatch();

  const gettingMines = useSelector((state: TRootState) => state?.loadingReducer[EGetMinesAction.GET_MINES]);
  const [grid, setGrid] = useState<TCellInformation[]>([]);
  const [gameStatus, setGameStatus] = useState<{ ended: boolean; playerWins: boolean }>({
    ended: false,
    playerWins: false,
  });
  const [timer, setTimer] = useState<string>('000');
  const [startTimer, setStartTimer] = useState<boolean>(false);

  const handleGrid = useCallback(
    ({ data: mines }: TGetMinesResponse): void => {
      const gridInformation = getGrid(mines, level);
      setGrid(gridInformation);
    },
    [level],
  );

  const exploreAround = (cells: TCellInformation[], targetCell: TCellInformation): TCellInformation[] => {
    let cellsExplored = [...cells];
    const validCellsAround = getCellsAround(cellsExplored, targetCell).filter(
      (cell) => !cell.isMine && !cell.isOpen,
    ) as TCellInformation[];
    cellsExplored = validCellsAround.map((cell) => ({ ...cell, isOpen: true }));
    const cellsNotHaveMinesAround = validCellsAround.filter(
      (cell) => cell.cellsAround.filter((suggestion) => suggestion.isMine).length === 0,
    );
    if (cellsNotHaveMinesAround.length > 0) {
      const cellsNeedFinding = cells.filter(
        (cell) => !cellsExplored.find((cellExplored) => cell.x === cellExplored.x && cell.y === cellExplored.y),
      );
      cellsNotHaveMinesAround.forEach((cellNotHaveMinesAround) => {
        cellsExplored = [...cellsExplored, ...exploreAround(cellsNeedFinding, cellNotHaveMinesAround)];
      });
    }
    return cellsExplored;
  };

  const openCell = (targetCell: TCellInformation): void => {
    if (!gameStatus.ended && !targetCell.isOpen) {
      const cellId = targetCell.id;
      const exploredCells = exploreAround(grid, targetCell);
      const gridUpdated = grid.map((cell) => {
        const isTargetCell = cell.id === cellId;
        const cellsAroundNeedExplore = exploredCells.find(
          (exploredCell) => exploredCell.x === cell.x && exploredCell.y === cell.y,
        );
        return isTargetCell || cellsAroundNeedExplore ? { ...cell, isOpen: true } : cell;
      });
      const clickOnMine = !!grid.find((cell) => cell.id === cellId && cell.isMine);
      const finalGrid = clickOnMine
        ? grid.map((cell) => (cell.isMine ? { ...cell, isOpen: true } : cell))
        : gridUpdated;
      const playerWins = finalGrid.filter((cell) => !cell.isMine).every((cell) => cell.isOpen);
      !startTimer && setStartTimer(true);
      setGameStatus({ ended: clickOnMine || playerWins, playerWins });
      setGrid(finalGrid);
    }
  };

  useEffect(() => {
    const isMaxTime = timer === '999';
    if (startTimer && !gameStatus.ended && !isMaxTime) {
      const timerTimeout = setTimeout(() => {
        const timeUpdated = +timer + 1;
        const totalCharacterTimer = 3;
        const timeAsString = convertTimeToString(timeUpdated, totalCharacterTimer);
        setTimer(timeAsString);
        clearTimeout(timerTimeout);
      }, 1000);
    }
  }, [startTimer, timer, gameStatus.ended]);

  useEffect(() => {
    const levelIsValid = isValidLevel(level);
    if (levelIsValid) {
      const params = getLevelParams(level);
      dispatch(getMinesAction.request({ params }, handleGrid));
    } else {
      navigate(Paths.Welcome);
    }
  }, [dispatch, handleGrid, level]);

  useEffect(() => {
    return (): void => {
      dispatch(uiActions.resetActionStatus(EGetMinesAction.GET_MINES));
    };
  }, [dispatch]);

  return (
    <LoadingFallback loading={gettingMines} fullPage>
      <div className={classNames('Game', level)}>
        <div className="Game__header">
          <img className="Game__clockIcon" src={IconClock} alt="Timer" />
          <span className="Game__timer">{timer}</span>
        </div>
        <div className="Game__graveYard">
          {grid.map((cell, cellIndex) => {
            const numberOfMinesAroundCell = cell.cellsAround.filter((suggestion) => suggestion.isMine).length;
            const boldCellEvenYard =
              (cellIndex % 2 === 0 && cell.y % 2 === 0) || (cellIndex % 2 !== 0 && cell.y % 2 !== 0);
            const lightCellEvenYard =
              (cellIndex % 2 !== 0 && cell.y % 2 === 0) || (cellIndex % 2 === 0 && cell.y % 2 !== 0);

            const boldCellOddYard = cellIndex % 2 === 0;
            const lightCellOddYard = cellIndex % 2 !== 0;
            return (
              <div
                className={classNames('Game__cell', level, {
                  isOpen: cell.isOpen,
                  bold: level === EGameLevel.BEGINNER ? boldCellOddYard : boldCellEvenYard,
                  light: level === EGameLevel.BEGINNER ? lightCellOddYard : lightCellEvenYard,
                })}
                key={cell.id}
                onClick={(): void => openCell(cell)}
              >
                {cell.isOpen && (
                  <div className="Game__suggestion">
                    {cell.isMine ? (
                      <span className="Game__mine" />
                    ) : (
                      <span className="Game__number">
                        {numberOfMinesAroundCell > 0 ? numberOfMinesAroundCell : ''}
                        {/* <span style={{ color: 'red' }}>
                          {cell.x}-{cell.y}
                        </span> */}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <ActionModal
        active={gameStatus.ended}
        title={`You ${gameStatus.playerWins ? 'WON' : 'LOST'} the game in ${convertTimeToHHMMSS(timer)}`}
        actions={[
          { label: 'Home page', stypeType: EButtonStyleType.SECONDARY, onClick: goToHomePage },
          { label: 'New game', onClick: restartGame },
        ]}
      />
    </LoadingFallback>
  );
};

export default Game;
