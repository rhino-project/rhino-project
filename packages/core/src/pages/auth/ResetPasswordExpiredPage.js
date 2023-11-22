import { DangerAlert } from 'rhino/components/alerts';
import { LinkButton } from 'rhino/components/buttons';
import { useForgotPasswordPath } from 'rhino/hooks/routes';
import AuthPage from './AuthPage';
import PropTypes from 'prop-types';

const ResetPasswordExpiredPage = (props) => {
  const forgotPasswordPath = useForgotPasswordPath();
  const authDesc = (
    <p>Enter new password and confirmation to change your password</p>
  );

  return (
    <AuthPage description={authDesc} {...props}>
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

ResetPasswordExpiredPage.propTypes = {
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

export default ResetPasswordExpiredPage;
