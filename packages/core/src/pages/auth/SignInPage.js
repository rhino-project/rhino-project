import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { APP_NAME } from 'config';
import { useParsedSearch } from 'rhino/hooks/history';
import { oauthProviders } from 'rhino/utils/models';
import { useSignInAction, useSignupAllowed } from 'rhino/queries/auth';
import AuthPage from './AuthPage';
import AuthForm from 'rhino/components/auth/AuthForm';
import { SuccessAlert } from 'rhino/components/alerts';
import OmniAuthButton from 'rhino/components/buttons/omniauth';
import { useForgotPasswordPath, useUserCreatePath } from 'rhino/hooks/routes';

const SignInPage = () => {
  const userCreatePath = useUserCreatePath();
  const forgotPasswordPath = useForgotPasswordPath();
  const queryParams = useParsedSearch();
  const allowSignup = useSignupAllowed();

  const { mutate: loginMutation, isLoading, error } = useSignInAction();

  const [isAuthenticating, setIsAuthenticating] = useState('');
  const confirmed = queryParams?.['account_confirmation_success'] === 'true';

  const handleSubmit = (formValues) => loginMutation(formValues);
  const handleAuth = (value) => setIsAuthenticating(value);

  const authDesc = (
    <>
      <p>Enter your email address and password to sign in.</p>
      {allowSignup && (
        <p>
          New to {APP_NAME}? <NavLink to={userCreatePath}>Sign Up</NavLink>
        </p>
      )}
    </>
  );

  return (
    <AuthPage description={authDesc}>
      <AuthForm
        emailField
        passwordField
        primaryAction="Sign In"
        secondaryAction={{
          content: 'Forgot Password?',
          url: forgotPasswordPath
        }}
        loading={isLoading}
        errors={error?.errors}
        onSubmit={handleSubmit}
      />
      {oauthProviders().length > 0 && <hr />}
      {oauthProviders().map((p) => (
        <OmniAuthButton
          key={p}
          provider={p}
          loading={isAuthenticating}
          handleAuth={handleAuth}
        />
      ))}
      {confirmed && (
        <SuccessAlert
          title="Account Confirmed"
          description="Your account has been confirmed, please sign in."
        />
      )}
    </AuthPage>
  );
};

export default SignInPage;
