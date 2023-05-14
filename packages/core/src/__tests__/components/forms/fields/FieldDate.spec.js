import { render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import FieldBooleanIndeterminate from 'rhino/components/forms/fields/FieldBooleanIndeterminate';
import FieldDate from 'rhino/components/forms/fields/FieldDate';

describe('FieldBooleanIndeterminate', () => {
  const FormWrapper = ({ children, defaultValues }) => {
    const methods = useForm({ defaultValues });
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

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
