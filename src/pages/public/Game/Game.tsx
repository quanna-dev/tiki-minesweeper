import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { navigate, useParams } from '@reach/router';
import classNames from 'classnames';

import { EGameLevel } from '@/common-types/common.d';
import { TOnContext } from '@/common-types/events';
import { EBreakpoints } from '@/common-types/ui-ux';

import { TRootState } from '@/redux/reducers';
import { EGetMinesAction, getMinesAction, uiActions } from '@/redux/actions';

import { TGetMinesParams, TGetMinesResponse } from '@/services/tiki-minesweeper';

import { Paths } from '@/pages/routers';
import LoadingFallback from '@/components/LoadingFallback';
import ActionModal from '@/components/ActionModal';
import { EButtonStyleType } from '@/components/Button';

import IconClock from '@/assets/icons/clock.png';
import IconFlag from '@/assets/icons/flag.png';
import IconShovel from '@/assets/icons/shovel.png';

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

  const deviceWidth = useSelector((state: TRootState) => state?.uiReducer.device.width);
  const isMobile = deviceWidth <= EBreakpoints.MD;
  const gettingMines = useSelector((state: TRootState) => state?.loadingReducer[EGetMinesAction.GET_MINES]);
  const [grid, setGrid] = useState<TCellInformation[]>([]);
  const [gameStatus, setGameStatus] = useState<{ ended: boolean; playerWins: boolean }>({
    ended: false,
    playerWins: false,
  });
  const [timer, setTimer] = useState<string>('000');
  const [startTimer, setStartTimer] = useState<boolean>(false);
  const [gameBasicInfo, setGameBasicInfo] = useState<TGetMinesParams>({ size: 0, mines: 0 });

  const usedFlags = grid.filter((cell) => cell.flag).length;
  const restFlags = gameBasicInfo.mines - usedFlags;

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
      (cell) => !cell.isMine && !cell.isOpen && !cell.flag,
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

  const clickToCell = (targetCell: TCellInformation): void => {
    if (!gameStatus.ended) {
      if (isMobile) {
        const gridUpdated = grid.map((cell) => ({
          ...cell,
          focusing: targetCell.isOpen ? false : cell.id === targetCell.id && !targetCell.focusing && !targetCell.flag,
          flag: cell.id === targetCell.id ? false : cell.flag,
        }));
        setGrid(gridUpdated);
      } else {
        !targetCell.flag && !targetCell.isOpen && openCell(targetCell);
      }
    }
  };

  const openCell = (targetCell: TCellInformation): void => {
    const cellId = targetCell.id;
    const isBlankCell = targetCell.cellsAround.filter((suggestion) => suggestion.isMine).length === 0;
    const exploredCells = isBlankCell ? exploreAround(grid, targetCell) : [targetCell];
    const gridUpdated = grid.map((cell) => {
      const isTargetCell = cell.id === cellId;
      const cellsAroundNeedExplore = exploredCells.find(
        (exploredCell) => exploredCell.x === cell.x && exploredCell.y === cell.y,
      );
      return isTargetCell || cellsAroundNeedExplore ? { ...cell, isOpen: true, focusing: false } : cell;
    });
    const clickOnMine = !!grid.find((cell) => cell.id === cellId && cell.isMine);
    const finalGrid = clickOnMine
      ? grid.map((cell) => (cell.isMine ? { ...cell, isOpen: true, focusing: false } : cell))
      : gridUpdated;
    const playerWins = finalGrid.filter((cell) => !cell.isMine).every((cell) => cell.isOpen);
    !startTimer && setStartTimer(true);
    setGameStatus({ ended: clickOnMine || playerWins, playerWins });
    setGrid(finalGrid);
  };

  const rightClickCell = (e: TOnContext, targetCell: TCellInformation): void => {
    e.preventDefault();
    setFlag(targetCell);
  };

  const setFlag = (targetCell: TCellInformation): void => {
    const stillCanSetFlag = restFlags > 0;
    const gridUpdated = grid.map((cell) =>
      cell.id === targetCell.id && !targetCell.isOpen
        ? { ...cell, flag: stillCanSetFlag ? !cell.flag : false, focusing: false }
        : cell,
    );
    setGrid(gridUpdated);
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
      setGameBasicInfo(params);
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
          <div className="Game__flagCounter">
            <img className="Game__flagIcon" src={IconFlag} alt="Flags" />
            <span className="Game__numberOfFlags">{restFlags}</span>
          </div>
          <div className="Game__timer">
            <img className="Game__clockIcon" src={IconClock} alt="Timer" />
            <span className="Game__seconds">{timer}</span>
          </div>
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
                  hasFlag: cell.flag,
                  bold: level === EGameLevel.BEGINNER ? boldCellOddYard : boldCellEvenYard,
                  light: level === EGameLevel.BEGINNER ? lightCellOddYard : lightCellEvenYard,
                  focusing: cell.focusing,
                })}
                key={cell.id}
              >
                {isMobile && (
                  <>
                    <div
                      className={classNames('Game__setFlagAction', {
                        show: cell.focusing && restFlags > 0,
                        left: cell.x > 0,
                        right: cell.x === 0,
                      })}
                      onClick={(): void => setFlag(cell)}
                    >
                      <img className="Game__setFlagAction-icon" src={IconFlag} alt="Set Flag" />
                    </div>
                    <div
                      className={classNames('Game__mineAction', {
                        show: cell.focusing,
                        top: cell.y > 0,
                        bottom: cell.y === 0,
                        topRightCorner: cell.x === gameBasicInfo.size - 1 && cell.y === 0,
                        bottomRightCorner: cell.x === gameBasicInfo.size - 1 && cell.y === gameBasicInfo.size - 1,
                        rightSide: cell.x === gameBasicInfo.size - 1,
                      })}
                      onClick={(): void => openCell(cell)}
                    >
                      <img className="Game__mineAction-icon" src={IconShovel} alt="Mine" />
                    </div>
                  </>
                )}
                <div
                  className="Game__cell-wrapper"
                  onClick={(): void => clickToCell(cell)}
                  onContextMenu={(e): void => rightClickCell(e, cell)}
                >
                  {cell.isOpen && (
                    <div className="Game__suggestion">
                      {cell.isMine ? (
                        <span className="Game__mine" />
                      ) : (
                        <span className="Game__number">
                          {numberOfMinesAroundCell > 0 ? numberOfMinesAroundCell : ''}
                        </span>
                      )}
                    </div>
                  )}
                  {cell.flag && !cell.isOpen && (
                    <img className={classNames('Game__flag', level)} src={IconFlag} alt="Flag" />
                  )}
                </div>
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
