import { Navigate } from 'react-router-dom';

import { Alert } from 'reactstrap';
import AuthForm from 'rhino/components/auth/AuthForm';
import { useAuthenticated } from 'rhino/hooks/auth';
import { useParsedSearch } from 'rhino/hooks/history';
import { useRootPath } from 'rhino/hooks/routes';
import { useAcceptInvitationAction } from 'rhino/queries/auth';
import AuthPage from './AuthPage';
import { DangerAlert } from '../../components/alerts';

const AcceptInvitationPage = () => {
  const rootPath = useRootPath();
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
  if (isAuthenticated) return <Navigate to={rootPath} replace />;
  const authDesc = <p>Enter a password to create account.</p>;
  return (
    <AuthPage description={authDesc}>
      {error?.errors['invitation_token'] && (
        <DangerAlert
          title={'Invitation token ' + error?.errors['invitation_token']}
        />
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
