import { AuthForm } from '../../components/auth/AuthForm';
import { OmniAuthButton } from '../../components/buttons/omniauth';
import { useParsedSearch } from '@rhino-project/core/hooks';
import { useSignInAction, useSignupAllowed } from '@rhino-project/core/queries';
import { oauthProviders } from '@rhino-project/core/utils';
import { AuthPage } from './AuthPage';
import { useRhinoConfig } from '@rhino-project/core/config';
import { Alert } from '@heroui/react';
import { RhinoLink } from '../../RhinoLink';

export const SignInPage = (props) => {
  const { appName } = useRhinoConfig();
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
          New to {appName}? <RhinoLink to="/auth/signup">Sign Up</RhinoLink>
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
          url: '/auth/reset-password'
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
        <Alert
          color="success"
          title="Account Confirmed"
          description="Your account has been confirmed, please sign in."
        />
      )}
    </AuthPage>
  );
};

// SignInPage.propTypes = {
//   description: PropTypes.node,
//   children: PropTypes.node,
//   currentPasswordField: PropTypes.bool,
//   errors: PropTypes.array,
//   emailField: PropTypes.bool,
//   loading: PropTypes.bool,
//   onSubmit: PropTypes.func,
//   organizationField: PropTypes.bool,
//   passwordField: PropTypes.bool,
//   passwordConfirmField: PropTypes.bool,
//   primaryAction: PropTypes.string,
//   secondaryAction: PropTypes.object
// };
