import { render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { FieldDate } from '../../../../Field';
import rhinoConfig from 'rhino.config';
import { createWrapper } from '../../../shared/helpers';
import { CalendarDate } from '@internationalized/date';

const getBarValue = () => 'bar';

describe('FieldDate', () => {
  const Bar = () => <div>Bar</div>;
  const placeholderValue = new CalendarDate(2025, 2, 7);

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
      .mockReturnValue({ ['FieldDate']: Bar });

    const { asFragment } = render(
      <FieldDate getValue={getBarValue} path="dummy" />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders inside of model context', () => {
    const { asFragment } = render(
      <FieldDate path="dummy" placeholderValue={placeholderValue} />,
      {
        wrapper: FormWrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('render with disabled', () => {
    const { asFragment } = render(
      <FieldDate path="dummy" placeholderValue={placeholderValue} />,
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
      <FieldDate path="dummy" placeholderValue={placeholderValue} />,
      {
        wrapper: createWrapper(FormWrapper, { defaultValues: { dummy: null } })
      }
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders empty with empty string date', () => {
    const { asFragment } = render(
      <FieldDate path="dummy" placeholderValue={placeholderValue} />,
      {
        wrapper: createWrapper(FormWrapper, { defaultValues: { dummy: '' } })
      }
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders date string', () => {
    const { asFragment } = render(
      <FieldDate path="dummy" placeholderValue={placeholderValue} />,
      {
        wrapper: createWrapper(FormWrapper, {
          defaultValues: { dummy: '2023-01-30' }
        })
      }
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders error', () => {
    const { asFragment } = render(
      <FieldDate path="dummy" placeholderValue={placeholderValue} />,
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
