import { render } from '@testing-library/react';
import { ModelFiltersSimple } from '../../../../components/models/ModelFiltersSimple';
import { ModelIndexSimple } from '../../../../components/models/ModelIndexSimple';
import { ModelFilterYear } from '../../../../components/models/filters/ModelFilterYear';
import { FilterYear } from '../../../../Filter';
import { createWrapper, RouterWrapper } from '../../../shared/helpers';

vi.mock('../../../../Filter', () => ({
  FilterYear: vi.fn(() => null)
}));

describe('ModelFilterYear', () => {
  const IndexWrapper = ({ children }) => {
    return (
      <ModelIndexSimple model="blog">
        <ModelFiltersSimple>{children}</ModelFiltersSimple>
      </ModelIndexSimple>
    );
  };

  const wrapper = createWrapper(RouterWrapper, {
    initialEntries: ['/1']
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it(`adds min as a prop`, () => {
    render(
      <IndexWrapper>
        <ModelFilterYear path="published_year_min" />
      </IndexWrapper>,
      {
        wrapper
      }
    );

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
    render(
      <IndexWrapper>
        <ModelFilterYear path="published_year_min_exclusive" />
      </IndexWrapper>,
      {
        wrapper
      }
    );

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
    render(
      <IndexWrapper>
        <ModelFilterYear path="published_year_max" />
      </IndexWrapper>,
      {
        wrapper
      }
    );
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
    render(
      <IndexWrapper>
        <ModelFilterYear path="published_year_max_exclusive" />
      </IndexWrapper>,
      {
        wrapper
      }
    );

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
