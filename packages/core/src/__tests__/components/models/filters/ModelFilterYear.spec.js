import { render } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import FilterYear from 'rhino/components/forms/filters/FilterYear';
import FormProvider from 'rhino/components/forms/FormProvider';
import ModelFilterYear from 'rhino/components/models/filters/ModelFilterYear';

jest.mock('rhino/components/forms/filters/FilterYear', () => {
  return jest.fn(() => null);
});

describe('ModelFilterYear', () => {
  const wrapper = ({ children }) => {
    const methods = useForm();
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it(`adds min as a prop`, () => {
    render(
      <ModelFilterYear
        model={{
          properties: {
            dummy: {
              type: 'integer',
              format: 'year',
              minimum: 1982
            }
          }
        }}
        path="dummy"
      />,
      {
        wrapper
      }
    );

    expect(FilterYear).toHaveBeenLastCalledWith(
      {
        min: new Date(1982, 0, 1),
        max: undefined,
        path: 'dummy'
      },
      expect.anything()
    );
  });

  it(`adds min as a prop with exclusiveMinimum`, () => {
    render(
      <ModelFilterYear
        model={{
          properties: {
            dummy: {
              type: 'integer',
              format: 'year',
              minimum: 1982,
              exclusiveMinimum: true
            }
          }
        }}
        path="dummy"
      />,
      {
        wrapper
      }
    );

    expect(FilterYear).toHaveBeenLastCalledWith(
      {
        min: new Date(1983, 0, 1),
        max: undefined,
        path: 'dummy'
      },
      expect.anything()
    );
  });

  it(`adds max as a prop`, () => {
    render(
      <ModelFilterYear
        model={{
          properties: {
            dummy: {
              type: 'integer',
              format: 'year',
              maximum: 2030
            }
          }
        }}
        path="dummy"
      />,
      {
        wrapper
      }
    );
    expect(FilterYear).toHaveBeenLastCalledWith(
      {
        min: undefined,
        max: new Date(2030, 0, 1),
        path: 'dummy'
      },
      expect.anything()
    );
  });

  it(`adds max as a prop with exclusiveMaximum`, () => {
    render(
      <ModelFilterYear
        model={{
          properties: {
            dummy: {
              type: 'integer',
              format: 'year',
              maximum: 2030,
              exclusiveMaximum: true
            }
          }
        }}
        path="dummy"
      />,
      {
        wrapper
      }
    );

    expect(FilterYear).toHaveBeenLastCalledWith(
      {
        min: undefined,
        max: new Date(2029, 0, 1),
        path: 'dummy'
      },
      expect.anything()
    );
  });
});
