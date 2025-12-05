import { render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { FieldDate } from '../../../../components/forms/fields/FieldDate';
import { sharedFieldTests } from './sharedFieldTests';
import { createWrapper } from '../../../shared/helpers';

describe('FieldDate', () => {
  const FormWrapper = ({ children, ...props }) => {
    const methods = useForm(props);
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  sharedFieldTests(FieldDate);

  it('renders empty with null date', () => {
    const { asFragment } = render(<FieldDate path="dummy" />, {
      wrapper: createWrapper(FormWrapper, { defaultValues: { dummy: null } })
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders empty with empty string date', () => {
    const { asFragment } = render(<FieldDate path="dummy" />, {
      wrapper: createWrapper(FormWrapper, { defaultValues: { dummy: '' } })
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders date string', () => {
    const { asFragment } = render(<FieldDate path="dummy" />, {
      wrapper: createWrapper(FormWrapper, {
        defaultValues: { dummy: '2023-01-30' }
      })
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders error', () => {
    const { asFragment } = render(<FieldDate path="dummy" />, {
      wrapper: createWrapper(FormWrapper, {
        defaultValues: { dummy: '' },
        errors: { dummy: { message: 'Error' } }
      })
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
