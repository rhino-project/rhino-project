import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ModelFiltersSimple } from '../../../../components/models/ModelFiltersSimple';
import { ModelIndexSimple } from '../../../../components/models/ModelIndexSimple';
import { ModelFilterDate } from '../../../../components/models/filters/ModelFilterDate';
import { FilterDate } from '../../../../Filter';
import { CalendarDate } from '@internationalized/date';

vi.mock('../../../../Filter', () => ({
  FilterDate: vi.fn(() => null)
}));

describe('ModelFilterDate', () => {
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
      expect.objectContaining({
        minValue: new CalendarDate(1982, 2, 7),
        maxValue: undefined,
        path: 'dummy'
      }),
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
      expect.objectContaining({
        minValue: new CalendarDate(1982, 2, 8),
        maxValue: undefined,
        path: 'dummy'
      }),
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
      expect.objectContaining({
        minValue: undefined,
        maxValue: new CalendarDate(2030, 2, 7),
        path: 'dummy'
      }),
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
      expect.objectContaining({
        minValue: undefined,
        maxValue: new CalendarDate(2030, 2, 6),
        path: 'dummy'
      }),
      expect.anything()
    );
  });
});
