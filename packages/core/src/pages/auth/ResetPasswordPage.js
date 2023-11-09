import { SuccessAlert } from 'rhino/components/alerts';
import AuthForm from 'rhino/components/auth/AuthForm';
import { LinkButton } from 'rhino/components/buttons';
import { useParsedSearch } from 'rhino/hooks/history';
import { useSessionCreatePath } from 'rhino/hooks/routes';
import { useResetPasswordAction } from 'rhino/queries/auth';
import AuthPage from './AuthPage';

const ResetPasswordPage = () => {
  const sessionCreatePath = useSessionCreatePath();
  const {
    mutate: resetPasswordAction,
    isLoading,
    isSuccess,
    data: { data: { message } = {} } = {},
    error
  } = useResetPasswordAction();

  const queryParams = useParsedSearch();

  const handleSubmit = (formValues) => {
    resetPasswordAction({ data: formValues, headers: queryParams });
  };

  const authDesc = (
    <p>Enter new password and confirmation to change your password</p>
  );

  return (
    <AuthPage description={authDesc}>
      <AuthForm
        passwordField
        passwordConfirmField
        primaryAction="Change Password"
        loading={isLoading}
        errors={error?.errors}
        onSubmit={handleSubmit}
      />
      {isSuccess && (
        <SuccessAlert title={message}>
          <LinkButton to={`../${sessionCreatePath}`}>Sign In</LinkButton>
        </SuccessAlert>
      )}
    </AuthPage>
  );
};

export default ResetPasswordPage;
