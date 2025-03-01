import {
  FormProviderProps,
  FormProvider as RHFFormProvider
} from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import env from '../../config/env';

export const FormProvider = (props: FormProviderProps) => {
  const { control } = props;

  return (
    <>
      {env.DEV && (
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
