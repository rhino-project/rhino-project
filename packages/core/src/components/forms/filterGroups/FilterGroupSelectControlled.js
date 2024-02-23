import { useMergedOverrides } from '../../../hooks/overrides';
import { FilterGroup } from '../FilterGroup';
import { FilterSelectControlled } from '../filters/FilterSelectControlled';

const BASE_OVERRIDES = { FilterLayout: { Field: FilterSelectControlled } };

export const FilterGroupSelectControlled = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FilterGroup overrides={mergedOverrides} {...props} />;
};
