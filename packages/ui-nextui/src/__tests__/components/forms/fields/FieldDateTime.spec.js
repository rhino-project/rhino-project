import { render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { FieldDateTime } from '../../../../Field';
import { sharedFieldTests } from './sharedFieldTests';
import { createWrapper } from '../../../shared/helpers';
import { ZonedDateTime } from '@internationalized/date';

describe('FieldDateTime', () => {
  const placeholderValue = new ZonedDateTime(
    2025,
    2,
    7,
    'America/New_York',
    '5',
    5,
    55
  );

  const FormWrapper = ({ children, ...props }) => {
    const methods = useForm(props);
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  sharedFieldTests(FieldDateTime);

  it('renders empty with null date', () => {
    const { asFragment } = render(
      <FieldDateTime path="dummy" placeholderValue={placeholderValue} />,
      {
        wrapper: createWrapper(FormWrapper, {
          defaultValues: { dummy: null }
        })
      }
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders empty with empty string date', () => {
    const { asFragment } = render(
      <FieldDateTime path="dummy" placeholderValue={placeholderValue} />,
      {
        wrapper: createWrapper(FormWrapper, {
          defaultValues: { dummy: '' }
        })
      }
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders error', () => {
    const { asFragment } = render(
      <FieldDateTime path="dummy" placeholderValue={placeholderValue} />,
      {
        wrapper: createWrapper(FormWrapper, {
          defaultValues: { dummy: '' },
          errors: { dummy: { message: 'Error' } }
        })
      }
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
