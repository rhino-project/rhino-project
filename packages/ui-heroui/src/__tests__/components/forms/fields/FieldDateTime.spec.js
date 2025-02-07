import { render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { FieldDateTime } from '../../../../Field';
import { createWrapper } from '../../../shared/helpers';
import { ZonedDateTime } from '@internationalized/date';
import rhinoConfig from 'rhino.config';

const getBarValue = () => 'bar';

describe('FieldDateTime', () => {
  const Bar = () => <div>Bar</div>;
  const placeholderValue = new ZonedDateTime(
    2025,
    2,
    7,
    'America/New_York',
    -18000000,
    5,
    5,
    55
  );

  const FormWrapper = ({ children, ...props }) => {
    const methods = useForm(props);
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  let configSpy;

  afterEach(() => {
    configSpy.mockRestore();
  });

  it(`should render with global override shorthand`, () => {
    configSpy = vi
      .spyOn(rhinoConfig, 'components', 'get')
      .mockReturnValue({ ['FieldDateTime']: Bar });

    const { asFragment } = render(
      <FieldDateTime
        getValue={getBarValue}
        path="dummy"
        placeholderValue={placeholderValue}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders inside of model context', () => {
    const { asFragment } = render(
      <FieldDateTime path="dummy" placeholderValue={placeholderValue} />,
      {
        wrapper: FormWrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('render with disabled', () => {
    const { asFragment } = render(
      <FieldDateTime path="dummy" placeholderValue={placeholderValue} />,
      {
        wrapper: createWrapper(FormWrapper, {
          disabled: true
        })
      }
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders empty with null date', () => {
    const { asFragment } = render(
      <FieldDateTime
        path="dummy"
        aria-label="dummy"
        placeholderValue={placeholderValue}
      />,
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
      <FieldDateTime
        path="dummy"
        aria-label="dummy"
        placeholderValue={placeholderValue}
      />,
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
      <FieldDateTime
        path="dummy"
        aria-label="dummy"
        placeholderValue={placeholderValue}
      />,
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
