import { useFormContext } from 'react-hook-form';
import { Alert } from '@heroui/react';

export const FormErrors = () => {
  const {
    formState: { errors }
  } = useFormContext();

  if (!errors?.root?.message) return null;

  return <Alert color="danger" title={errors.root.message} />;
};
