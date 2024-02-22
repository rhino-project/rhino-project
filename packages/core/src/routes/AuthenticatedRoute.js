import PropTypes from 'prop-types';

import { Navigate, useLocation } from 'react-router-dom';
import { usePrevious } from 'react-use';
import { SplashScreen } from '../components/logos';
import { useAuth } from '../hooks/auth';
import { useSessionCreatePath } from '../hooks/routes';
import { getPrevPathSession, setPrevPathSession, unsetPrevPathSession } from '../utils/storage';

const AuthenticatedRoute = ({ children }) => {
  const sessionCreatePath = useSessionCreatePath({ absolute: true });
  const { initializing, user } = useAuth();
  const previousUser = usePrevious(user);
  const location = useLocation();

  if (initializing) {
    return <SplashScreen />;
  } else if (user) {
    const path = getPrevPathSession();

    if (path) {
      unsetPrevPathSession();
      return <Navigate to={path} replace />;
    }
    return children;
  } else if (!user && previousUser) {
    // means sign out, no need for storing prevPath
    return <Navigate to={sessionCreatePath} replace />;
  } else {
    // means tried to open a page but was not signed in yet,
    // needs to store prevPath
    setPrevPathSession(location.pathname + location.search);
    return <Navigate to={sessionCreatePath} replace />;
  }
};

AuthenticatedRoute.propTypes = {
  children: PropTypes.node
};

export default AuthenticatedRoute;
