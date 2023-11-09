import PropTypes from 'prop-types';
import { Navigate } from 'react-router';
import { SplashScreen } from 'rhino/components/logos';
import { useAuth } from 'rhino/hooks/auth';
import { useAuthenticatedAppPath } from 'rhino/hooks/routes';

const NonAuthenticatedRoute = ({ children }) => {
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

export default NonAuthenticatedRoute;
