import { render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import FieldBooleanIndeterminate from 'rhino/components/forms/fields/FieldBooleanIndeterminate';

describe('FieldBooleanIndeterminate', () => {
  const FormWrapper = ({ children, defaultValues }) => {
    const methods = useForm({ defaultValues });
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  it('renders true as Boolean', () => {
    const { asFragment } = render(<FieldBooleanIndeterminate path="dummy" />, {
      wrapper: (props) => (
        <FormWrapper {...props} defaultValues={{ dummy: true }} />
      )
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders true as String', () => {
    const { asFragment } = render(<FieldBooleanIndeterminate path="dummy" />, {
      wrapper: (props) => (
        <FormWrapper {...props} defaultValues={{ dummy: 'true' }} />
      )
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders false as Boolean', () => {
    const { asFragment } = render(<FieldBooleanIndeterminate path="dummy" />, {
      wrapper: (props) => (
        <FormWrapper {...props} defaultValues={{ dummy: false }} />
      )
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders false as String', () => {
    const { asFragment } = render(<FieldBooleanIndeterminate path="dummy" />, {
      wrapper: (props) => (
        <FormWrapper {...props} defaultValues={{ dummy: 'false' }} />
      )
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders indeterminate with null', () => {
    const { asFragment } = render(<FieldBooleanIndeterminate path="dummy" />, {
      wrapper: (props) => (
        <FormWrapper {...props} defaultValues={{ dummy: null }} />
      )
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders indeterminate with undefined', () => {
    const { asFragment } = render(<FieldBooleanIndeterminate path="dummy" />, {
      wrapper: (props) => (
        <FormWrapper {...props} defaultValues={{ dummy: undefined }} />
      )
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
