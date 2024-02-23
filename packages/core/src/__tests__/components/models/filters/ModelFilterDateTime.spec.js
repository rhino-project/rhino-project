import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ModelFiltersSimple from 'rhino/components/models/ModelFiltersSimple';
import ModelIndexSimple from 'rhino/components/models/ModelIndexSimple';
import ModelFilterDateTime from 'rhino/components/models/filters/ModelFilterDateTime';
import FilterDateTime from 'rhino/components/forms/filters/FilterDateTime';

vi.mock('rhino/components/forms/filters/FilterDateTime', () => ({
  default: vi.fn(() => null)
}));

describe('ModelFilterDateTime', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const Wrapper = ({ children, ...props }) => {
    const queryClient = new QueryClient();

    return (
      <MemoryRouter {...props}>
        <QueryClientProvider client={queryClient}>
          <ModelIndexSimple model="blog">
            <ModelFiltersSimple>{children}</ModelFiltersSimple>
          </ModelIndexSimple>
        </QueryClientProvider>
      </MemoryRouter>
    );
  };
  it(`adds min as a prop`, () => {
    render(
      <ModelFilterDateTime
        model={{
          properties: {
            dummy: {
              type: 'string',
              format: 'date',
              minimum: '1982-02-07T05:00:00.000Z'
            }
          }
        }}
        path="dummy"
      />,
      {
        wrapper: Wrapper
      }
    );

    expect(FilterDateTime).toHaveBeenLastCalledWith(
      {
        min: new Date('1982-02-07T05:00:00.000Z'),
        max: undefined,
        path: 'dummy'
      },
      expect.anything()
    );
  });

  it(`adds min as a prop with exclusiveMinimum`, () => {
    render(
      <ModelFilterDateTime
        model={{
          properties: {
            dummy: {
              type: 'string',
              format: 'date',
              minimum: '1982-02-07T05:00:00.000Z',
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
    expect(FilterDateTime).toHaveBeenLastCalledWith(
      {
        min: new Date('1982-02-07T05:00:00.001Z'),
        max: undefined,
        path: 'dummy'
      },
      expect.anything()
    );
  });

  it(`adds max as a prop`, () => {
    render(
      <ModelFilterDateTime
        model={{
          properties: {
            dummy: {
              type: 'string',
              format: 'date',
              maximum: '2030-02-07T05:00:00.000Z'
            }
          }
        }}
        path="dummy"
      />,
      {
        wrapper: Wrapper
      }
    );

    expect(FilterDateTime).toHaveBeenLastCalledWith(
      {
        min: undefined,
        max: new Date('2030-02-07T05:00:00.000Z'),
        path: 'dummy'
      },
      expect.anything()
    );
  });

  it(`adds max as a prop with exclusiveMaximum`, () => {
    render(
      <ModelFilterDateTime
        model={{
          properties: {
            dummy: {
              type: 'string',
              format: 'date',
              maximum: '2030-02-07T05:00:00.000Z',
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

    expect(FilterDateTime).toHaveBeenLastCalledWith(
      {
        min: undefined,
        max: new Date('2030-02-07T04:59:59.999Z'),
        path: 'dummy'
      },
      expect.anything()
    );
  });
});
