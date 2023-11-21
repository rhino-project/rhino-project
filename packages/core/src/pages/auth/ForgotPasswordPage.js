import { SuccessAlert } from 'rhino/components/alerts';
import AuthForm from 'rhino/components/auth/AuthForm';
import { useSessionCreatePath } from 'rhino/hooks/routes';
import { useForgotPasswordAction } from 'rhino/queries/auth';
import AuthPage from './AuthPage';
import PropTypes from 'prop-types';

const ForgotPasswordPage = ({ ...props }) => {
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
        primaryAction={{
          content: 'Reset Password'
        }}
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
  primaryAction: PropTypes.object,
  secondaryAction: PropTypes.object
};

export default ForgotPasswordPage;
