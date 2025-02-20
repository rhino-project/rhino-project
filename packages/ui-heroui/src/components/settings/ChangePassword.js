import { useEffect, useState } from 'react';

import { useUserUpdateAction } from '@rhino-project/core/queries';
import { AuthForm } from '../auth/AuthForm';
import { Alert } from '@heroui/react';

export const ChangePassword = () => {
  const [showAlert, setShowAlert] = useState(false);
  const {
    mutate: userUpdate,
    isLoading,
    isSuccess,
    error
  } = useUserUpdateAction();

  useEffect(() => setShowAlert(isSuccess), [isSuccess]);

  const handleSubmit = (formValues) => userUpdate(formValues);

  return (
    <>
      <AuthForm
        currentPasswordField
        passwordField
        passwordConfirmField
        primaryAction="Change Password"
        isLoading={isLoading}
        errors={error?.errors}
        onSubmit={handleSubmit}
      />

      <Alert
        color="success"
        title="Your password has been changed successfully"
        isClosable
        isVisible={showAlert}
        onClose={() => setShowAlert(false)}
      />
    </>
  );
};
