import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ModelFiltersSimple } from '../../../../components/models/ModelFiltersSimple';
import { ModelIndexSimple } from '../../../../components/models/ModelIndexSimple';
import { ModelFilterDateTime } from '../../../../components/models/filters/ModelFilterDateTime';
import { FilterDateTime } from '../../../../Filter';
import { parseAbsoluteToLocal } from '@internationalized/date';

vi.mock('../../../../Filter', () => ({
  FilterDateTime: vi.fn(() => null)
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
    render(<ModelFilterDateTime path="published_at_min" />, {
      wrapper: Wrapper
    });

    expect(FilterDateTime).toHaveBeenLastCalledWith(
      expect.objectContaining({
        minValue: parseAbsoluteToLocal('1982-02-07T05:00:00.000Z'),
        maxValue: undefined,
        path: 'published_at_min'
      }),
      expect.anything()
    );
  });

  it(`adds min as a prop with exclusiveMinimum`, () => {
    render(<ModelFilterDateTime path="published_at_min_exclusive" />, {
      wrapper: Wrapper
    });
    expect(FilterDateTime).toHaveBeenLastCalledWith(
      expect.objectContaining({
        minValue: parseAbsoluteToLocal('1982-02-07T05:00:01.000Z'),
        maxValue: undefined,
        path: 'published_at_min_exclusive'
      }),
      expect.anything()
    );
  });

  it(`adds max as a prop`, () => {
    render(<ModelFilterDateTime path="published_at_max" />, {
      wrapper: Wrapper
    });

    expect(FilterDateTime).toHaveBeenLastCalledWith(
      expect.objectContaining({
        minValue: undefined,
        maxValue: parseAbsoluteToLocal('2030-02-07T05:00:00.000Z'),
        path: 'published_at_max'
      }),
      expect.anything()
    );
  });

  it(`adds max as a prop with exclusiveMaximum`, () => {
    render(<ModelFilterDateTime path="published_at_max_exclusive" />, {
      wrapper: Wrapper
    });

    expect(FilterDateTime).toHaveBeenLastCalledWith(
      expect.objectContaining({
        minValue: undefined,
        maxValue: parseAbsoluteToLocal('2030-02-07T04:59:59.000Z'),
        path: 'published_at_max_exclusive'
      }),
      expect.anything()
    );
  });
});
