import { useFormContext } from 'react-hook-form';
import { DangerAlert } from '../alerts';

export const FormErrors = () => {
  const {
    formState: { errors }
  } = useFormContext();

  if (!errors?.root?.message) return null;

  return <DangerAlert>{errors.root.message}</DangerAlert>;
};
