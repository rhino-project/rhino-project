import { render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { FieldTime } from '../../../../components/forms/fields/FieldTime';
import { sharedFieldTests } from './sharedFieldTests';
import { createWrapper } from '../../../shared/helpers';

describe('FieldTime', () => {
  const FormWrapper = ({ children, ...props }) => {
    const methods = useForm(props);
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  sharedFieldTests(FieldTime);

  it('renders empty with null date', () => {
    const { asFragment } = render(<FieldTime path="dummy" />, {
      wrapper: createWrapper(FormWrapper, {
        defaultValues: { dummy: null }
      })
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders empty with empty string date', () => {
    const { asFragment } = render(<FieldTime path="dummy" />, {
      wrapper: createWrapper(FormWrapper, {
        defaultValues: { dummy: '' }
      })
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders error', () => {
    const { asFragment } = render(<FieldTime path="dummy" />, {
      wrapper: createWrapper(FormWrapper, {
        defaultValues: { dummy: '' },
        errors: { dummy: { message: 'Error' } }
      })
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
