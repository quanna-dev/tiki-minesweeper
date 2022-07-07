import React from 'react';

import { EGameLevel } from '@/common-types/common.d';
import Button, { EButtonStyleType } from '@/components/Button';

import { startGame } from './Welcome.functions';
import { TWelcomeProps } from './Welcome.types.d';
import './Welcome.scss';

const Welcome: React.FC<TWelcomeProps> = () => {
  return (
    <div className="Welcome">
      <h1 className="Welcome__title">
        Welcome to <span className="Welcome__title-highlight">Tiki</span> Minesweeper
      </h1>
      <div className="Welcome__levels">
        <div className="Welcome__level">
          <Button label={EGameLevel.BEGINNER} onClick={(): Promise<void> => startGame(EGameLevel.BEGINNER)} />
        </div>
        <div className="Welcome__level" onClick={(): Promise<void> => startGame(EGameLevel.ADVANTAGE)}>
          <Button label={EGameLevel.ADVANTAGE} stypeType={EButtonStyleType.SECONDARY} />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
