import { useGlobalOverrides } from 'rhino/hooks/overrides';
import FilterGroup from '../forms/FilterGroup';
import ModelFilter from './ModelFilter';
import ModelFilterLabel from './ModelFilterLabel';

const defaultComponents = {
  FilterGroup
};

export const ModelFilterGroup = ({ overrides, ...props }) => {
  const { FilterGroup } = useGlobalOverrides(defaultComponents, overrides);

  return (
    <FilterGroup
      overrides={{
        FilterLayout: { FilterLabel: ModelFilterLabel, Filter: ModelFilter }
      }}
      {...props}
    />
  );
};

export default FilterGroup;
