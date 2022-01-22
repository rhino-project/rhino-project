import React from 'react';

import { useUserUpdateAction } from 'rhino/queries/auth';
import AuthForm from 'rhino/components/auth/AuthForm';
import { SuccessAlert } from 'rhino/components/alerts';

const ChangePassword = () => {
  const {
    mutate: userUpdate,
    isLoading,
    isSuccess,
    error
  } = useUserUpdateAction();

  const handleSubmit = (formValues) => userUpdate(formValues);

  return (
    <>
      <AuthForm
        currentPasswordField
        passwordField
        passwordConfirmField
        primaryAction="Change Password"
        loading={isLoading}
        errors={error?.errors}
        onSubmit={handleSubmit}
      />
      {isSuccess && (
        <SuccessAlert title="Your password has been changed successfully" />
      )}
    </>
  );
};

export default ChangePassword;
