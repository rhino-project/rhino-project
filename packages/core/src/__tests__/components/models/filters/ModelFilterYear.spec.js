import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FilterYear } from '../../../../components/forms/filters/FilterYear';
import { ModelFiltersSimple } from '../../../../components/models/ModelFiltersSimple';
import { ModelIndexSimple } from '../../../../components/models/ModelIndexSimple';
import { ModelFilterYear } from '../../../../components/models/filters/ModelFilterYear';

vi.mock('../../../../components/forms/filters/FilterYear', () => ({
  FilterYear: vi.fn(() => null)
}));

describe('ModelFilterYear', () => {
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
  beforeEach(() => {
    vi.clearAllMocks();
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
        wrapper: Wrapper
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
        wrapper: Wrapper
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
        wrapper: Wrapper
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
        wrapper: Wrapper
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
