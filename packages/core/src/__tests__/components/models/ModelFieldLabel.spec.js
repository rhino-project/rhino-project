import { render } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import FormProvider from 'rhino/components/forms/FormProvider';
import ModelFieldLabel from 'rhino/components/models/ModelFieldLabel';
import { sharedModelTests } from './sharedModelTests';

describe('ModelFieldLabel', () => {
  const Wrapper = ({ children }) => {
    const methods = useForm();
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  sharedModelTests(ModelFieldLabel);

  it(`should render label with readable name`, () => {
    const { asFragment } = render(
      <ModelFieldLabel
        model={{
          properties: { dummy: { type: 'string', readableName: 'Dummy' } }
        }}
        path="dummy"
      />,
      {
        wrapper: Wrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it(`should override label with prop`, () => {
    const { asFragment } = render(
      <ModelFieldLabel
        model={{
          properties: { dummy: { type: 'string', readableName: 'Dummy' } }
        }}
        label="Dummy Override"
        path="dummy"
      />,
      {
        wrapper: Wrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
