import { render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { FieldSelectControlled } from '../../../../components/forms/fields/FieldSelectControlled';
import { sharedFieldTests } from './sharedFieldTests';

describe('FieldSelectControlled', () => {
  const FormWrapper = ({ children, defaultValues }) => {
    const methods = useForm({ defaultValues });
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  sharedFieldTests(FieldSelectControlled);

  it('renders with title', () => {
    const { asFragment } = render(
      <FieldSelectControlled path="dummy" title="Test Title">
        <option value="a">Option A</option>
        <option value="b">Option B</option>
      </FieldSelectControlled>,
      {
        wrapper: (props) => (
          <FormWrapper {...props} defaultValues={{ dummy: null }} />
        )
      }
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with title and no options', () => {
    const { asFragment } = render(
      <FieldSelectControlled path="dummy" title="Test Title" />,
      {
        wrapper: (props) => (
          <FormWrapper {...props} defaultValues={{ dummy: null }} />
        )
      }
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
