import React from 'react';

import { useUserUpdateAction } from '../../queries/auth';
import AuthForm from '../auth/AuthForm';
import { SuccessAlert } from '../alerts';

export const ChangePassword = () => {
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
