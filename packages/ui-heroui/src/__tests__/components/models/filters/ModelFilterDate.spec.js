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
    render(<ModelFilterDate path="published_date_min" />, {
      wrapper: Wrapper
    });

    expect(FilterDate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        minValue: new CalendarDate(1982, 2, 7),
        maxValue: undefined,
        path: 'published_date_min'
      }),
      expect.anything()
    );
  });

  it(`adds min as a prop with exclusiveMinimum`, () => {
    render(<ModelFilterDate path="published_date_min_exclusive" />, {
      wrapper: Wrapper
    });

    expect(FilterDate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        minValue: new CalendarDate(1982, 2, 8),
        maxValue: undefined,
        path: 'published_date_min_exclusive'
      }),
      expect.anything()
    );
  });

  it(`adds max as a prop`, () => {
    render(<ModelFilterDate path="published_date_max" />, {
      wrapper: Wrapper
    });

    expect(FilterDate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        minValue: undefined,
        maxValue: new CalendarDate(2030, 2, 7),
        path: 'published_date_max'
      }),
      expect.anything()
    );
  });

  it(`adds max as a prop with exclusiveMaximum`, () => {
    render(<ModelFilterDate path="published_date_max_exclusive" />, {
      wrapper: Wrapper
    });

    expect(FilterDate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        minValue: undefined,
        maxValue: new CalendarDate(2030, 2, 6),
        path: 'published_date_max_exclusive'
      }),
      expect.anything()
    );
  });
});
