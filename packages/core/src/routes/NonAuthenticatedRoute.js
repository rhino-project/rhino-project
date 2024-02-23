import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { SplashScreen } from '../components/logos';
import { useAuth } from '../hooks/auth';
import { useAuthenticatedAppPath } from '../hooks/routes';

export const NonAuthenticatedRoute = ({ children }) => {
  const authenticatedAppPath = useAuthenticatedAppPath();
  const { initializing, user } = useAuth();

  if (initializing) {
    return <SplashScreen />;
  } else if (!user) {
    return children;
  } else {
    return <Navigate to={authenticatedAppPath} replace />;
  }
};

NonAuthenticatedRoute.propTypes = {
  children: PropTypes.node
};
