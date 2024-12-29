import { Target } from '../../components/layouts';
import PropTypes from 'prop-types';
import { useGlobalComponentForModel } from '@rhino-project/core/hooks';
import { ThemedLogo } from '../../components/logos';

const AuthPageBase = ({ children, description }) => {
  return (
    <div className="h-full flex items-center justify-center">
      <Target>
        <div className="p-3 shadow rounded flex flex-col md:flex-row">
          <div className="my-auto md:w-1/2">
            <div className="auth-logo">
              <ThemedLogo />
            </div>
            {description}
          </div>
          <div className="my-auto md:w-1/2">{children}</div>
        </div>
      </Target>
    </div>
  );
};

AuthPageBase.propTypes = {
  children: PropTypes.node,
  description: PropTypes.node
};

export const AuthPage = (props) =>
  useGlobalComponentForModel('AuthPage', AuthPageBase, props);
