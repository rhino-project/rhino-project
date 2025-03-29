import PropTypes from 'prop-types';
import { FormProvider as RHFFormProvider } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';

export const FormProvider = ({ children, ...props }) => {
  const { control } = props;

  return (
    <>
      {process.env.NODE_ENV === 'development' && (
        <DevTool
          control={control}
          placement={'top-left'}
          styles={{
            button: {
              width: '20px'
            }
          }}
        />
      )}
      <RHFFormProvider {...props}>{children}</RHFFormProvider>
    </>
  );
};

FormProvider.propTypes = {
  children: PropTypes.node
};
