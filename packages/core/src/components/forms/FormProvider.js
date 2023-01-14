import PropTypes from 'prop-types';
import { FormProvider as RHFFormProvider } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';

const FormProvider = ({ children, ...props }) => {
  const { control } = props;

  return (
    <>
      <DevTool control={control} placement={'top-right'} />
      <RHFFormProvider {...props}>{children}</RHFFormProvider>
    </>
  );
};

FormProvider.propTypes = {
  children: PropTypes.node
};

export default FormProvider;
