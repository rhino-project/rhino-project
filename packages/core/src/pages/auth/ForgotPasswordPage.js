import React from 'react';

import routePaths from 'rhino/routes';
import { useForgotPasswordAction } from 'rhino/queries/auth';
import AuthPage from './AuthPage';
import AuthForm from 'rhino/components/auth/AuthForm';
import { SuccessAlert } from 'rhino/components/alerts';

const ForgotPasswordPage = () => {
  const {
    mutate: forgotPasswordAction,
    isLoading,
    isSuccess,
    data: { data: { message } = {} } = {},
    error
  } = useForgotPasswordAction();

  const handleSubmit = (formValues) => forgotPasswordAction(formValues);

  return (
    <AuthPage description="Enter email to reset your password.">
      <AuthForm
        emailField
        primaryAction="Reset Password"
        secondaryAction={{
          content: 'Sign In',
          url: routePaths.sessionCreate()
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
