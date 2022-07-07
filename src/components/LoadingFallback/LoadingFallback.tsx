import React from 'react';
import classNames from 'classnames';

import Spinner from '@/components/Spinner';

import { TLoadingFallbackProps } from './LoadingFallback.types';
import './LoadingFallback.scss';

const LoadingFallback: React.FC<TLoadingFallbackProps> = ({ children, loading = true, fullPage }) => {
  return <div className={classNames('LoadingFallback', { fullPage, loading })}>{loading ? <Spinner /> : children}</div>;
};

export default LoadingFallback;
