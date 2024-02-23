import { useFormContext } from 'react-hook-form';
import { DangerAlert } from '../alerts';

const FormErrors = () => {
  const {
    formState: { errors }
  } = useFormContext();

  if (!errors?.root?.message) return null;

  return <DangerAlert>{errors.root.message}</DangerAlert>;
};

export default FormErrors;
