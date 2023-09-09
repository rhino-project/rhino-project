import { render } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import FilterDate from 'rhino/components/forms/filters/FilterDate';
import FormProvider from 'rhino/components/forms/FormProvider';
import ModelFilterDate from 'rhino/components/models/filters/ModelFilterDate';

vi.mock('rhino/components/forms/filters/FilterDate', () => ({
  default: vi.fn(() => null)
}));

describe('ModelFilterDate', () => {
  const Wrapper = ({ children }) => {
    const methods = useForm();
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it(`adds min as a prop`, () => {
    render(
      <ModelFilterDate
        model={{
          properties: {
            dummy: {
              type: 'string',
              format: 'date',
              minimum: '1982-02-07'
            }
          }
        }}
        path="dummy"
      />,
      {
        wrapper: Wrapper
      }
    );

    expect(FilterDate).toHaveBeenLastCalledWith(
      {
        min: new Date('1982-02-07T00:00:00.000Z'),
        max: undefined,
        path: 'dummy'
      },
      expect.anything()
    );
  });

  it(`adds min as a prop with exclusiveMinimum`, () => {
    render(
      <ModelFilterDate
        model={{
          properties: {
            dummy: {
              type: 'string',
              format: 'date',
              minimum: '1982-02-07',
              exclusiveMinimum: true
            }
          }
        }}
        path="dummy"
      />,
      {
        wrapper: Wrapper
      }
    );

    expect(FilterDate).toHaveBeenLastCalledWith(
      {
        min: new Date('1982-02-07T00:00:00.001Z'),
        max: undefined,
        path: 'dummy'
      },
      expect.anything()
    );
  });

  it(`adds max as a prop`, () => {
    render(
      <ModelFilterDate
        model={{
          properties: {
            dummy: {
              type: 'string',
              format: 'date',
              maximum: '2030-02-07'
            }
          }
        }}
        path="dummy"
      />,
      {
        wrapper: Wrapper
      }
    );

    expect(FilterDate).toHaveBeenLastCalledWith(
      {
        min: undefined,
        max: new Date('2030-02-07T00:00:00.000Z'),
        path: 'dummy'
      },
      expect.anything()
    );
  });

  it(`adds max as a prop with exclusiveMaximum`, () => {
    render(
      <ModelFilterDate
        model={{
          properties: {
            dummy: {
              type: 'string',
              format: 'date',
              maximum: '2030-02-07',
              exclusiveMaximum: true
            }
          }
        }}
        path="dummy"
      />,
      {
        wrapper: Wrapper
      }
    );

    expect(FilterDate).toHaveBeenLastCalledWith(
      {
        min: undefined,
        max: new Date('2030-02-06T23:59:59.999Z'),
        path: 'dummy'
      },
      expect.anything()
    );
  });
});
