import { render } from '@testing-library/react';
import { ModelFiltersSimple } from '../../../../components/models/ModelFiltersSimple';
import { ModelIndexSimple } from '../../../../components/models/ModelIndexSimple';
import { ModelFilterDate } from '../../../../components/models/filters/ModelFilterDate';
import { FilterDate } from '../../../../Filter';
import { CalendarDate } from '@internationalized/date';
import { createWrapper, RouterWrapper } from '../../../shared/helpers';

vi.mock('../../../../Filter', () => ({
  FilterDate: vi.fn(() => null)
}));

describe('ModelFilterDate', () => {
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

  it(`adds min as a prop`, () => {
    render(
      <IndexWrapper>
        <ModelFilterDate path="published_date_min" />
      </IndexWrapper>,
      {
        wrapper
      }
    );

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
    render(
      <IndexWrapper>
        <ModelFilterDate path="published_date_min_exclusive" />
      </IndexWrapper>,
      {
        wrapper
      }
    );

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
    render(
      <IndexWrapper>
        <ModelFilterDate path="published_date_max" />
      </IndexWrapper>,
      {
        wrapper
      }
    );

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
    render(
      <IndexWrapper>
        <ModelFilterDate path="published_date_max_exclusive" />
      </IndexWrapper>,
      {
        wrapper
      }
    );

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
