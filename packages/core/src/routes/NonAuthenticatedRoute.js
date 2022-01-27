import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router';
import routePaths from '.';
import { SplashScreen } from 'rhino/components/logos';
import { useAuth } from 'rhino/hooks/auth';

const NonAuthenticatedRoute = ({ children, ...rest }) => {
  const { initializing, user } = useAuth();

  return (
    <Route
      {...rest}
      render={() => {
        if (initializing) {
          return <SplashScreen />;
        } else if (!user) {
          return children;
        } else {
          return <Redirect to={routePaths.rootpath()} />;
        }
      }}
    />
  );
};

NonAuthenticatedRoute.propTypes = {
  children: PropTypes.node
};

export default NonAuthenticatedRoute;
