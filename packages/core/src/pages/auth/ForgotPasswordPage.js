import { SuccessAlert } from 'rhino/components/alerts';
import AuthForm from 'rhino/components/auth/AuthForm';
import { useSessionCreatePath } from 'rhino/hooks/routes';
import { useForgotPasswordAction } from 'rhino/queries/auth';
import AuthPage from './AuthPage';

const ForgotPasswordPage = ({ description }) => {
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
    <AuthPage
      description={description || 'Enter email to reset your password.'}
    >
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
      />
      {isSuccess && (
        <SuccessAlert title="Reset Password" description={message} />
      )}
    </AuthPage>
  );
};

export default ForgotPasswordPage;
