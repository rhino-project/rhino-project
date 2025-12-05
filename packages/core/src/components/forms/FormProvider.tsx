import {
  FormProviderProps,
  FormProvider as RHFFormProvider
} from 'react-hook-form';
import { DevTool } from '@hookform/devtools';

export const FormProvider = (props: FormProviderProps) => {
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
      <RHFFormProvider {...props} />
    </>
  );
};
