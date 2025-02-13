import { AuthForm } from '../../components/auth/AuthForm';
import { useParsedSearch } from '@rhino-project/core/hooks';
import { useAcceptInvitationAction } from '@rhino-project/core/queries';
import { AuthPage } from './AuthPage';
import PropTypes from 'prop-types';
import { Alert } from '@heroui/react';

export const AcceptInvitationPage = (props) => {
  const {
    mutate: acceptAction,
    isLoading,
    error
  } = useAcceptInvitationAction();
  const params = useParsedSearch();
  const handleSubmit = (formValues) => {
    acceptAction({ ...formValues, ...params });
  };

  const authDesc = <p>Enter a password to create account.</p>;
  return (
    <AuthPage description={authDesc} {...props}>
      {error?.errors['invitation_token'] && (
        <Alert
          color="danger"
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
