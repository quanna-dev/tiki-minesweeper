import React from 'react';
import classNames from 'classnames';

import { EButtonStyleType } from './Button.enums';
import { TButtonProps } from './Button.types.d';
import './Button.scss';

const Button: React.FC<TButtonProps> = ({ label, stypeType = EButtonStyleType.PRIMARY, ...rest }) => {
  return (
    <button className={classNames('Button', stypeType)} {...rest}>
      {label}
    </button>
  );
};

export default Button;
