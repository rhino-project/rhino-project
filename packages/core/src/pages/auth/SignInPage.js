import { APP_NAME } from 'config';
import { NavLink } from 'react-router-dom';
import { SuccessAlert } from 'rhino/components/alerts';
import AuthForm from 'rhino/components/auth/AuthForm';
import OmniAuthButton from 'rhino/components/buttons/omniauth';
import { useParsedSearch } from 'rhino/hooks/history';
import { useForgotPasswordPath, useUserCreatePath } from 'rhino/hooks/routes';
import { useSignInAction, useSignupAllowed } from 'rhino/queries/auth';
import { oauthProviders } from 'rhino/utils/models';
import AuthPage from './AuthPage';

const SignInPage = () => {
  const userCreatePath = useUserCreatePath();
  const forgotPasswordPath = useForgotPasswordPath();
  const queryParams = useParsedSearch();
  const allowSignup = useSignupAllowed();

  const { mutate: loginMutation, isLoading, error } = useSignInAction();

  const confirmed = queryParams?.['account_confirmation_success'] === 'true';

  const handleSubmit = (formValues) => loginMutation(formValues);

  const authDesc = (
    <>
      <p>Enter your email address and password to sign in.</p>
      {allowSignup && (
        <p>
          New to {APP_NAME}? <NavLink to={userCreatePath}>Sign Up</NavLink>
        </p>
      )}
    </>
  );

  return (
    <AuthPage description={authDesc}>
      <AuthForm
        emailField
        passwordField
        primaryAction="Sign In"
        secondaryAction={{
          content: 'Forgot Password?',
          url: forgotPasswordPath
        }}
        loading={isLoading}
        errors={error?.errors}
        onSubmit={handleSubmit}
      />
      {oauthProviders().length > 0 && <hr />}
      <div className="d-flex justify-content-center">
        {oauthProviders().map((p) => (
          <OmniAuthButton
            key={p.name}
            provider={p.name}
            providerPath={p.path}
          />
        ))}
      </div>
      {confirmed && (
        <SuccessAlert
          title="Account Confirmed"
          description="Your account has been confirmed, please sign in."
        />
      )}
    </AuthPage>
  );
};

export default SignInPage;
