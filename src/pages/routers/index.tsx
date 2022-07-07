import React, { lazy, Suspense } from 'react';
import { Redirect } from '@reach/router';

import LoadingFallback from '@/components/LoadingFallback';

import { IRouteProps } from './types.d';
import { EGameLevel } from '@/common-types/common.d';
// import authHelpers from '@/services/helpers';

const retryLoadComponent = (fn: () => Promise<unknown>, retriesLeft = 5, interval = 1000): any =>
  new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            reject(error);
            return;
          }

          retryLoadComponent(fn, retriesLeft - 1, interval).then(resolve, reject);
        }, interval);
      });
  });

// public
const Welcome = lazy(() => retryLoadComponent(() => import('@/pages/public/Welcome')));
const Game = lazy(() => retryLoadComponent(() => import('@/pages/public/Game')));

// private

export const LayoutPaths = {};

export const Paths = {
  // public
  Welcome: '/',
  Game: (level?: EGameLevel): string => `/game/${level || ':level'}`,

  // private

  Rest: '*',
};

export const Pages = {
  Welcome,
  Game,
};

export const ProtectedRoute: React.FC<IRouteProps> = ({ component: Component, ...rest }) => {
  // const loggedIn = authHelpers.getAccessToken();
  const loggedIn = true;

  return loggedIn ? (
    <Suspense fallback={<LoadingFallback fullPage />}>
      <Component {...rest} />
    </Suspense>
  ) : (
    <Redirect from="" to={Paths.Welcome} noThrow />
  );
};

export const PublicRoute: React.FC<IRouteProps> = ({ component: Component, ...rest }) => (
  <Suspense fallback={<div />}>
    <Component {...rest} />
  </Suspense>
);
