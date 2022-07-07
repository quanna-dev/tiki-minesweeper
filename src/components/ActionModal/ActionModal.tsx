import React from 'react';
import classNames from 'classnames';

import Button from '@/components/Button';

import { TActionModalProps } from './ActionModal.types.d';
import './ActionModal.scss';

const ActionModal: React.FC<TActionModalProps> = ({ active, title, actions }) => {
  return (
    <div className={classNames('ActionModal', { active })}>
      <div className={classNames('ActionModal__popup', { active })}>
        <h1 className="ActionModal__popup-title">{title}</h1>
        <div className="ActionModal__popup-actions">
          {actions.map((action) => (
            <Button key={action.label} {...action} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
