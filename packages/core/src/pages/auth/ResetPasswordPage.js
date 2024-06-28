import { SuccessAlert } from '../../components/alerts';
import { AuthForm } from '../../components/auth/AuthForm';
import { LinkButton } from '../../components/buttons';
import { useParsedSearch } from '../../hooks/history';
import { useSessionCreatePath } from '../../hooks/routes';
import { useResetPasswordAction } from '../../queries/auth';
import { AuthPage } from './AuthPage';
import PropTypes from 'prop-types';

export const ResetPasswordPage = (props) => {
  const sessionCreatePath = useSessionCreatePath();
  const {
    mutate: resetPasswordAction,
    isLoading,
    isSuccess,
    data: { data: { message } = {} } = {},
    error
  } = useResetPasswordAction();

  const { reset_password_token } = useParsedSearch();

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
        loading={isLoading}
        errors={error?.errors}
        onSubmit={handleSubmit}
        {...props}
      />
      {isSuccess && (
        <SuccessAlert title={message}>
          <LinkButton to={`../${sessionCreatePath}`}>Sign In</LinkButton>
        </SuccessAlert>
      )}
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
