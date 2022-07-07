import React, { useEffect } from 'react';
import { Router, Redirect } from '@reach/router';
import { useDispatch } from 'react-redux';

import { uiActions } from '@/redux/actions';
import { Paths, Pages, PublicRoute } from '@/pages/routers';

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const updateSize = (): void => {
      dispatch(uiActions.setDevice(window.innerWidth));
    };
    window.addEventListener('resize', updateSize);
    return (): void => window.removeEventListener('resize', updateSize);
  }, [dispatch]);

  return (
    <Router primary={false}>
      <PublicRoute path={Paths.Welcome} component={Pages.Welcome} />
      <PublicRoute path={Paths.Game()} component={Pages.Game} />
      <Redirect noThrow from={Paths.Rest} to={Paths.Welcome} />
    </Router>
  );
};

export default App;
