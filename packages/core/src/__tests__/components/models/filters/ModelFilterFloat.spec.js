import { render } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import FormProvider from 'rhino/components/forms/FormProvider';
import ModelFilterFloat from 'rhino/components/models/filters/ModelFilterFloat';

describe('ModelFilterFloat', () => {
  const Wrapper = ({ children }) => {
    const methods = useForm();
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  it(`adds min as a prop`, () => {
    const { asFragment } = render(
      <ModelFilterFloat
        model={{ properties: { dummy: { type: 'integer', minimum: 5 } } }}
        path="dummy"
      />,
      {
        wrapper: Wrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it(`adds min as a prop with exclusiveMinimum`, () => {
    const { asFragment } = render(
      <ModelFilterFloat
        model={{
          properties: {
            dummy: { type: 'integer', minimum: 5, exclusiveMinimum: true }
          }
        }}
        path="dummy"
      />,
      {
        wrapper: Wrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it(`adds max as a prop`, () => {
    const { asFragment } = render(
      <ModelFilterFloat
        model={{ properties: { dummy: { type: 'integer', maximum: 5 } } }}
        path="dummy"
      />,
      {
        wrapper: Wrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it(`adds max as a prop with exclusiveMaximum`, () => {
    const { asFragment } = render(
      <ModelFilterFloat
        model={{
          properties: {
            dummy: { type: 'integer', maximum: 5, exclusiveMaximum: true }
          }
        }}
        path="dummy"
      />,
      {
        wrapper: Wrapper
      }
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
