import { render } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import FormProvider from '../../../components/forms/FormProvider';
import ModelDisplayLabel from '../../../components/models/ModelDisplayLabel';
import { sharedModelTests } from './sharedModelTests';

describe('ModelDisplayLabel', () => {
  const Wrapper = ({ children }) => {
    const methods = useForm();
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  sharedModelTests(ModelDisplayLabel);

  it(`should render label with readable name`, () => {
    const { asFragment } = render(
      <ModelDisplayLabel
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
      <ModelDisplayLabel
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
