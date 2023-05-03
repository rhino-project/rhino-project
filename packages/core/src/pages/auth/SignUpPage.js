import React from 'react';
import { NavLink, Redirect } from 'react-router-dom';

import { useSignUpAction } from 'rhino/queries/auth';
import { APP_NAME } from 'config';
import AuthPage from './AuthPage';
import AuthForm from 'rhino/components/auth/AuthForm';
import { hasOrganizationsModule } from 'rhino/utils/models';
import { useAuthenticated } from 'rhino/hooks/auth';
import { useRootPath, useSessionCreatePath } from 'rhino/hooks/routes';

const SignUpPage = () => {
  const rootPath = useRootPath();
  const sessionCreatePath = useSessionCreatePath();
  const isAuthenticated = useAuthenticated();
  const { mutate: signUpAction, isLoading, error } = useSignUpAction();

  // If we signin successfully, redirect
  // FIXME Redirect pattern should be an HOC
  if (isAuthenticated) return <Redirect to={rootPath} />;

  const handleSubmit = (formValues) => signUpAction(formValues);

  const authDesc = (
    <>
      <p>Enter your email address and password to create account.</p>
      <br />
      <p>
        Already have a {APP_NAME} account?{' '}
        <NavLink to={sessionCreatePath}>Sign In</NavLink>
      </p>
    </>
  );

  return (
    <AuthPage description={authDesc}>
      <AuthForm
        emailField
        passwordField
        passwordConfirmField
        organizationField={hasOrganizationsModule()}
        primaryAction="Sign Up"
        loading={isLoading}
        errors={error?.errors}
        onSubmit={handleSubmit}
      />
    </AuthPage>
  );
};

export default SignUpPage;
