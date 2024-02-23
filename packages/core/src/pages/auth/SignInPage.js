import { NavLink } from 'react-router-dom';
import { SuccessAlert } from '../../components/alerts';
import { AuthForm } from '../../components/auth/AuthForm';
import { OmniAuthButton } from '../../components/buttons/omniauth';
import { useParsedSearch } from '../../hooks/history';
import { useForgotPasswordPath, useUserCreatePath } from '../../hooks/routes';
import { useSignInAction, useSignupAllowed } from '../../queries/auth';
import { oauthProviders } from '../../utils/models';
import { AuthPage } from './AuthPage';
import { useRhinoConfig } from '@rhino-project/config';
import PropTypes from 'prop-types';

export const SignInPage = (props) => {
  const { appName } = useRhinoConfig();
  const userCreatePath = useUserCreatePath();
  const forgotPasswordPath = useForgotPasswordPath();
  const queryParams = useParsedSearch();
  const allowSignup = useSignupAllowed();

  const { mutate: loginMutation, isLoading, error } = useSignInAction();

  const confirmed = queryParams?.['account_confirmation_success'] === 'true';

  const handleSubmit = (formValues) => loginMutation(formValues);

  const authDesc = (
    <>
      <p>Enter your email address and password to sign in.</p>
      {allowSignup && (
        <p>
          New to {appName}?{' '}
          <NavLink to={`../${userCreatePath}`}>Sign Up</NavLink>
        </p>
      )}
    </>
  );

  return (
    <AuthPage description={authDesc} {...props}>
      <AuthForm
        emailField
        passwordField
        primaryAction="Sign In"
        secondaryAction={{
          content: 'Forgot Password?',
          url: `../${forgotPasswordPath}`
        }}
        loading={isLoading}
        errors={error?.errors}
        onSubmit={handleSubmit}
        {...props}
      />
      {oauthProviders().length > 0 && <hr />}
      <div className="d-flex justify-content-center">
        {oauthProviders().map((p) => (
          <OmniAuthButton
            key={p.name}
            provider={p.name}
            providerPath={p.path}
          />
        ))}
      </div>
      {confirmed && (
        <SuccessAlert
          title="Account Confirmed"
          description="Your account has been confirmed, please sign in."
        />
      )}
    </AuthPage>
  );
};

SignInPage.propTypes = {
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
