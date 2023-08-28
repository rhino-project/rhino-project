import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router';
import { SplashScreen } from 'rhino/components/logos';
import { useAuth } from 'rhino/hooks/auth';
import { useRootPath } from 'rhino/hooks/routes';

const NonAuthenticatedRoute = ({ children, ...rest }) => {
  const rootPath = useRootPath();
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
          return <Redirect to={rootPath} />;
        }
      }}
    />
  );
};

NonAuthenticatedRoute.propTypes = {
  children: PropTypes.node
};

export default NonAuthenticatedRoute;
