import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ModelFiltersSimple } from '../../../../components/models/ModelFiltersSimple';
import { ModelIndexSimple } from '../../../../components/models/ModelIndexSimple';
import { ModelFilterYear } from '../../../../components/models/filters/ModelFilterYear';
import { FilterYear } from '../../../../Filter';

vi.mock('../../../../Filter', () => ({
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
    render(<ModelFilterYear path="published_year_min" />, {
      wrapper: Wrapper
    });

    expect(FilterYear).toHaveBeenLastCalledWith(
      expect.objectContaining({
        min: 1982,
        max: undefined,
        path: 'published_year_min'
      }),
      expect.anything()
    );
  });

  it(`adds min as a prop with exclusiveMinimum`, () => {
    render(<ModelFilterYear path="published_year_min_exclusive" />, {
      wrapper: Wrapper
    });

    expect(FilterYear).toHaveBeenLastCalledWith(
      expect.objectContaining({
        min: 1983,
        max: undefined,
        path: 'published_year_min_exclusive'
      }),
      expect.anything()
    );
  });

  it(`adds max as a prop`, () => {
    render(<ModelFilterYear path="published_year_max" />, {
      wrapper: Wrapper
    });
    expect(FilterYear).toHaveBeenLastCalledWith(
      expect.objectContaining({
        min: undefined,
        max: 2030,
        path: 'published_year_max'
      }),
      expect.anything()
    );
  });

  it(`adds max as a prop with exclusiveMaximum`, () => {
    render(<ModelFilterYear path="published_year_max_exclusive" />, {
      wrapper: Wrapper
    });

    expect(FilterYear).toHaveBeenLastCalledWith(
      expect.objectContaining({
        min: undefined,
        max: 2029,
        path: 'published_year_max_exclusive'
      }),
      expect.anything()
    );
  });
});
