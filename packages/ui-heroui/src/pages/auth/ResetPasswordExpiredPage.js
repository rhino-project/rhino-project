import { LinkButton } from '../../components/buttons';
import { useForgotPasswordPath } from '@rhino-project/core/hooks';
import { AuthPage } from './AuthPage';
import { Alert } from '@heroui/react';

export const ResetPasswordExpiredPage = (props) => {
  const forgotPasswordPath = useForgotPasswordPath();

  return (
    <AuthPage {...props}>
      <Alert
        color="danger"
        title="Password reset token has expired"
        description="You tried to reset your password but the secure link has expired."
        endContent={
          <LinkButton outline to={`../${forgotPasswordPath}`}>
            Forgot password?
          </LinkButton>
        }
      />
    </AuthPage>
  );
};
