import { Navigate } from 'react-router-dom';
import { AuthForm } from '../../components/auth/AuthForm';
import { useAuthenticated } from '../../hooks/auth';
import { useParsedSearch } from '../../hooks/history';
import { useRootPath } from '../../hooks/routes';
import { useAcceptInvitationAction } from '../../queries/auth';
import { AuthPage } from './AuthPage';
import { DangerAlert } from '../../components/alerts';
import PropTypes from 'prop-types';

export const AcceptInvitationPage = (props) => {
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
    <AuthPage description={authDesc} {...props}>
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
        {...props}
      />
    </AuthPage>
  );
};

AcceptInvitationPage.propTypes = {
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
