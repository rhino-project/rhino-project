import React from 'react';
import routePaths from 'rhino/routes';

import AuthPage from './AuthPage';
import { DangerAlert } from 'rhino/components/alerts';
import { LinkButton } from 'rhino/components/buttons';

const ResetPasswordExpiredPage = () => {
  const authDesc = (
    <p>Enter new password and confirmation to change your password</p>
  );

  return (
    <AuthPage description={authDesc}>
      <DangerAlert
        title="Password reset token has expired"
        description="You tried to reset your password but the secure link has expired."
      >
        <LinkButton outline to={routePaths.forgotPassword()}>
          Forgot password?
        </LinkButton>
      </DangerAlert>
    </AuthPage>
  );
};

export default ResetPasswordExpiredPage;
