import { SuccessAlert } from '../../components/alerts';
import { AuthForm } from '../../components/auth/AuthForm';
import { useSessionCreatePath } from '../../hooks/routes';
import { useForgotPasswordAction } from '../../queries/auth';
import { AuthPage } from './AuthPage';
import PropTypes from 'prop-types';

export const ForgotPasswordPage = (props) => {
  const sessionCreatePath = useSessionCreatePath();
  const {
    mutate: forgotPasswordAction,
    isLoading,
    isSuccess,
    data: { data: { message } = {} } = {},
    error
  } = useForgotPasswordAction();

  const handleSubmit = (formValues) => forgotPasswordAction(formValues);

  return (
    <AuthPage description="Enter email to reset your password." {...props}>
      <AuthForm
        emailField
        primaryAction="Reset Password"
        secondaryAction={{
          content: 'Sign In',
          url: `../${sessionCreatePath}`
        }}
        loading={isLoading}
        errors={error?.errors}
        onSubmit={handleSubmit}
        {...props}
      />
      {isSuccess && (
        <SuccessAlert title="Reset Password" description={message} />
      )}
    </AuthPage>
  );
};

ForgotPasswordPage.propTypes = {
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
