import { AuthForm } from '../../components/auth/AuthForm';
import { useSignUpAction } from '@rhino-project/core/queries';
import {
  hasOrganizationsModule,
  oauthProviders
} from '@rhino-project/core/utils';
import { AuthPage } from './AuthPage';
import { useRhinoConfig } from '@rhino-project/core/config';
import PropTypes from 'prop-types';
import { OmniAuthButton } from '../../components/buttons/omniauth';
import { RhinoLink } from '../../RhinoLink';

export const SignUpPage = (props) => {
  const { appName } = useRhinoConfig();
  const { mutate: signUpAction, isPending, error } = useSignUpAction();

  const handleSubmit = (formValues) => signUpAction(formValues);

  const authDesc = (
    <>
      <p>Enter your email address and password to create account.</p>
      <br />
      <p>
        Already have a {appName} account?{' '}
        <RhinoLink to="/auth/signin">Sign In</RhinoLink>
      </p>
    </>
  );

  return (
    <AuthPage description={authDesc} {...props}>
      <AuthForm
        emailField
        passwordField
        passwordConfirmField
        organizationField={hasOrganizationsModule()}
        primaryAction="Sign Up"
        loading={isPending}
        errors={error?.errors}
        onSubmit={handleSubmit}
        {...props}
      />
      {oauthProviders().length > 0 && <hr />}
      <div className="flex flex-row justify-center">
        {oauthProviders().map((p) => (
          <OmniAuthButton
            key={p.name}
            provider={p.name}
            providerPath={p.path}
          />
        ))}
      </div>
    </AuthPage>
  );
};

SignUpPage.propTypes = {
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
