import { DangerAlert } from 'rhino/components/alerts';
import { LinkButton } from 'rhino/components/buttons';
import { useForgotPasswordPath } from 'rhino/hooks/routes';
import AuthPage from './AuthPage';

const ResetPasswordExpiredPage = () => {
  const forgotPasswordPath = useForgotPasswordPath();
  const authDesc = (
    <p>Enter new password and confirmation to change your password</p>
  );

  return (
    <AuthPage description={authDesc}>
      <DangerAlert
        title="Password reset token has expired"
        description="You tried to reset your password but the secure link has expired."
      >
        <LinkButton outline to={`../${forgotPasswordPath}`}>
          Forgot password?
        </LinkButton>
      </DangerAlert>
    </AuthPage>
  );
};

export default ResetPasswordExpiredPage;
