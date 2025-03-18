import { AuthForm } from '../../components/auth/AuthForm';
import { OmniAuthButton } from '../../components/buttons/omniauth';
import { useSignInAction, useSignupAllowed } from '@rhino-project/core/queries';
import { oauthProviders } from '@rhino-project/core/utils';
import { AuthPage } from './AuthPage';
import { useRhinoConfig } from '@rhino-project/core/config';
import { Alert } from '@heroui/react';
import { Link, useSearch } from '@tanstack/react-router';

// @ts-expect-error FIXME: typing properly
export const SignInPage = (props) => {
  const { appName } = useRhinoConfig();
  const { account_confirmation_success } = useSearch({
    strict: false
  });
  const allowSignup = useSignupAllowed();

  const { mutate: loginMutation, isPending, error } = useSignInAction();

  const confirmed = account_confirmation_success === 'true';

  // @ts-expect-error FIXME: typing properly
  const handleSubmit = (formValues) => loginMutation(formValues);

  const authDesc = (
    <>
      <p>Enter your email address and password to sign in.</p>
      {allowSignup && (
        <p>
          New to {appName}? <Link to="/auth/signup">Sign Up</Link>
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
        loading={isPending}
        // @ts-expect-error FIXME: typing properly
        errors={error?.errors}
        onSubmit={handleSubmit}
        {...props}
      />
      {oauthProviders().length > 0 && <hr />}
      <div className="d-flex justify-content-center">
        {/* @ts-expect-error FIXME: typing properly */}
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
