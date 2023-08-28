import { render } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import FormProvider from 'rhino/components/forms/FormProvider';
import ModelFilterLabel from 'rhino/components/models/ModelFilterLabel';
import { sharedModelTests } from './sharedModelTests';

describe('ModelFilterLabel', () => {
  const wrapper = ({ children }) => {
    const methods = useForm();
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  sharedModelTests(ModelFilterLabel);

  it(`should render label with readable name`, () => {
    const { asFragment } = render(
      <ModelFilterLabel
        model={{
          properties: { dummy: { type: 'string', readableName: 'Dummy' } }
        }}
        path="dummy"
      />,
      {
        wrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it(`should override label with prop`, () => {
    const { asFragment } = render(
      <ModelFilterLabel
        model={{
          properties: { dummy: { type: 'string', readableName: 'Dummy' } }
        }}
        label="Dummy Override"
        path="dummy"
      />,
      {
        wrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
