import { render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import FieldDate from 'rhino/components/forms/fields/FieldDate';
import { sharedFieldTests } from './sharedFieldTests';

describe('FieldDate', () => {
  const FormWrapper = ({ children, defaultValues }) => {
    const methods = useForm({ defaultValues });
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  sharedFieldTests(FieldDate);

  it('renders empty with null date', () => {
    const { asFragment } = render(<FieldDate path="dummy" />, {
      wrapper: (props) => (
        <FormWrapper {...props} defaultValues={{ dummy: null }} />
      )
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders empty with empty string date', () => {
    const { asFragment } = render(<FieldDate path="dummy" />, {
      wrapper: (props) => (
        <FormWrapper {...props} defaultValues={{ dummy: '' }} />
      )
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders date string', () => {
    const { asFragment } = render(<FieldDate path="dummy" />, {
      wrapper: (props) => (
        <FormWrapper {...props} defaultValues={{ dummy: '2023-01-30' }} />
      )
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
