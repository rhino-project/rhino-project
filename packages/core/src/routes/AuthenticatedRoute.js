import PropTypes from 'prop-types';

import { useAuth } from 'rhino/hooks/auth';
import { Redirect, Route } from 'react-router';
import routePaths from '.';
import { SplashScreen } from 'rhino/components/logos';
import { usePrevious } from 'rhino/hooks/util';
import {
  getPrevPathSession,
  setPrevPathSession,
  unsetPrevPathSession
} from 'rhino/utils/storage';

const AuthenticatedRoute = ({ children, ...rest }) => {
  const { initializing, user } = useAuth();
  const previousUser = usePrevious(user);

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (initializing) {
          return <SplashScreen />;
        } else if (user) {
          const path = getPrevPathSession();

          if (path) {
            unsetPrevPathSession();
            return <Redirect to={path} />;
          }
          return children;
        } else if (!user && previousUser) {
          // means sign out, no need for storing prevPath
          return <Redirect to={routePaths.sessionCreate()} />;
        } else {
          // means tried to open a page but was not signed in yet,
          // needs to store prevPath
          setPrevPathSession(location.pathname + location.search);
          return <Redirect to={routePaths.sessionCreate()} />;
        }
      }}
    />
  );
};

AuthenticatedRoute.propTypes = {
  children: PropTypes.node
};

export default AuthenticatedRoute;
