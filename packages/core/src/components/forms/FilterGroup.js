import { useGlobalOverrides } from 'rhino/hooks/overrides';
import FilterLayoutVertical from './FilterLayoutVertical';

const defaultComponents = {
  FilterLayout: FilterLayoutVertical
};

export const FilterGroup = ({ overrides, ...props }) => {
  const { FilterLayout } = useGlobalOverrides(defaultComponents, overrides);

  return <FilterLayout {...props} />;
};

export default FilterGroup;
