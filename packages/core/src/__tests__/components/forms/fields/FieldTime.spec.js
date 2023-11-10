import { render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import FieldTime from 'rhino/components/forms/fields/FieldTime';
import { sharedFieldTests } from './sharedFieldTests';

describe('FieldTime', () => {
  const FormWrapper = ({ children, defaultValues }) => {
    const methods = useForm({ defaultValues });
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  sharedFieldTests(FieldTime);

  it('renders empty with null date', () => {
    const { asFragment } = render(<FieldTime path="dummy" />, {
      wrapper: (props) => (
        <FormWrapper {...props} defaultValues={{ dummy: null }} />
      )
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders empty with empty string date', () => {
    const { asFragment } = render(<FieldTime path="dummy" />, {
      wrapper: (props) => (
        <FormWrapper {...props} defaultValues={{ dummy: '' }} />
      )
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
