import { render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import FieldYear from '../../../../components/forms/fields/FieldYear';
import { sharedFieldTests } from './sharedFieldTests';

describe('FieldYear', () => {
  const FormWrapper = ({ children, defaultValues }) => {
    const methods = useForm({ defaultValues });
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  sharedFieldTests(FieldYear);

  it('renders empty with null date', () => {
    const { asFragment } = render(<FieldYear path="dummy" />, {
      wrapper: (props) => (
        <FormWrapper {...props} defaultValues={{ dummy: null }} />
      )
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders empty with empty string date', () => {
    const { asFragment } = render(<FieldYear path="dummy" />, {
      wrapper: (props) => (
        <FormWrapper {...props} defaultValues={{ dummy: '' }} />
      )
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
