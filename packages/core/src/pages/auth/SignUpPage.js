import { Navigate, NavLink } from 'react-router-dom';

import { AuthForm } from '../../components/auth/AuthForm';
import { useAuthenticated } from '../../hooks/auth';
import { useRootPath, useSessionCreatePath } from '../../hooks/routes';
import { useSignUpAction } from '../../queries/auth';
import { hasOrganizationsModule } from '../../utils/models';
import { AuthPage } from './AuthPage';
import { useRhinoConfig } from '@rhino-project/config';
import PropTypes from 'prop-types';

export const SignUpPage = (props) => {
  const { appName } = useRhinoConfig();
  const rootPath = useRootPath();
  const sessionCreatePath = useSessionCreatePath();
  const isAuthenticated = useAuthenticated();
  const { mutate: signUpAction, isLoading, error } = useSignUpAction();

  // If we signin successfully, redirect
  // FIXME Redirect pattern should be an HOC
  if (isAuthenticated) return <Navigate to={rootPath} replace />;

  const handleSubmit = (formValues) => signUpAction(formValues);

  const authDesc = (
    <>
      <p>Enter your email address and password to create account.</p>
      <br />
      <p>
        Already have a {appName} account?{' '}
        <NavLink to={`../${sessionCreatePath}`}>Sign In</NavLink>
      </p>
    </>
  );

  return (
    <AuthPage description={authDesc} {...props}>
      <AuthForm
        emailField
        passwordField
        passwordConfirmField
        organizationField={hasOrganizationsModule()}
        primaryAction="Sign Up"
        loading={isLoading}
        errors={error?.errors}
        onSubmit={handleSubmit}
        {...props}
      />
    </AuthPage>
  );
};

SignUpPage.propTypes = {
  description: PropTypes.node,
  children: PropTypes.node,
  currentPasswordField: PropTypes.bool,
  errors: PropTypes.array,
  emailField: PropTypes.bool,
  loading: PropTypes.bool,
  onSubmit: PropTypes.func,
  organizationField: PropTypes.bool,
  passwordField: PropTypes.bool,
  passwordConfirmField: PropTypes.bool,
  primaryAction: PropTypes.string,
  secondaryAction: PropTypes.object
};
