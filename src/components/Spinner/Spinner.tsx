import React from 'react';

import IconBallSpinner from '@/assets/icons/ball-spinner.svg';

import { TSpinnerProps } from './Spinner.types';
import './Spinner.scss';

const Spinner: React.FC<TSpinnerProps> = () => {
  return <img className="Spinner" src={IconBallSpinner} alt="Loading..." />;
};

export default Spinner;
