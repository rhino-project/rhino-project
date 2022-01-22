import React from 'react';
import { Redirect } from 'react-router-dom';
import routePaths from 'rhino/routes';

import { useAcceptInvitationAction } from 'rhino/queries/auth';
import AuthPage from './AuthPage';
import AuthForm from 'rhino/components/auth/AuthForm';
import { useAuthenticated } from 'rhino/hooks/auth';
import { useParsedSearch } from 'rhino/hooks/history';
import { Alert } from 'reactstrap';

const AcceptInvitationPage = () => {
  const isAuthenticated = useAuthenticated();
  const {
    mutate: acceptAction,
    isLoading,
    error
  } = useAcceptInvitationAction();
  const params = useParsedSearch();
  const handleSubmit = (formValues) => {
    acceptAction({ ...formValues, ...params });
  };

  // If we signin successfully, redirect
  // FIXME Redirect pattern should be an HOC
  if (isAuthenticated) return <Redirect to={routePaths.rootpath()} />;
  const authDesc = <p>Enter a password to create account.</p>;
  return (
    <AuthPage description={authDesc}>
      {error?.errors['invitation_token'] && (
        <Alert color="danger">
          {'Invitation token ' + error?.errors['invitation_token']}
        </Alert>
      )}
      <AuthForm
        passwordField
        passwordConfirmField
        primaryAction="Set"
        loading={isLoading}
        errors={error?.errors}
        onSubmit={handleSubmit}
      />
    </AuthPage>
  );
};

export default AcceptInvitationPage;
