import { AuthForm } from '../../components/auth/AuthForm';
import { LinkButton } from '../../components/buttons';
import { useSessionCreatePath } from '@rhino-project/core/hooks';
import { useResetPasswordAction } from '@rhino-project/core/queries';
import { AuthPage } from './AuthPage';
import PropTypes from 'prop-types';
import { Alert } from '@heroui/react';
import { useSearch } from '@tanstack/react-router';

export const ResetPasswordPage = (props) => {
  const sessionCreatePath = useSessionCreatePath();
  const {
    mutate: resetPasswordAction,
    isPending,
    isSuccess,
    data: { data: { message } = {} } = {},
    error
  } = useResetPasswordAction();

  const { reset_password_token } = useSearch({ strict: false });

  const handleSubmit = (formValues) => {
    resetPasswordAction({ data: { ...formValues, reset_password_token } });
  };

  const authDesc = (
    <p>Enter new password and confirmation to change your password</p>
  );

  return (
    <AuthPage description={authDesc} {...props}>
      <AuthForm
        passwordField
        passwordConfirmField
        primaryAction="Change Password"
        loading={isPending}
        errors={error?.errors}
        onSubmit={handleSubmit}
        {...props}
      />
      <Alert
        title={message}
        isVisible={isSuccess}
        endContent={
          <LinkButton to={`../${sessionCreatePath}`}>Sign In</LinkButton>
        }
      />
    </AuthPage>
  );
};

ResetPasswordPage.propTypes = {
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
