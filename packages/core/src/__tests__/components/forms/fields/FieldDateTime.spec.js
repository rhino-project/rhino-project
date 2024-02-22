import { render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import FieldDateTime from '../../../../components/forms/fields/FieldDateTime';
import { sharedFieldTests } from './sharedFieldTests';

describe('FieldDateTime', () => {
  const FormWrapper = ({ children, defaultValues }) => {
    const methods = useForm({ defaultValues });
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  sharedFieldTests(FieldDateTime);

  it('renders empty with null date', () => {
    const { asFragment } = render(<FieldDateTime path="dummy" />, {
      wrapper: (props) => (
        <FormWrapper {...props} defaultValues={{ dummy: null }} />
      )
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders empty with empty string date', () => {
    const { asFragment } = render(<FieldDateTime path="dummy" />, {
      wrapper: (props) => (
        <FormWrapper {...props} defaultValues={{ dummy: '' }} />
      )
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
