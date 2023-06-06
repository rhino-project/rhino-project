import { useGlobalComponent, useOverrides } from 'rhino/hooks/overrides';
import FilterLayoutVertical from './FilterLayoutVertical';

const defaultComponents = {
  FilterLayout: FilterLayoutVertical
};

export const FilterGroupBase = ({ overrides, ...props }) => {
  const { FilterLayout } = useOverrides(defaultComponents, overrides);

  return <FilterLayout {...props} />;
};

const FilterGroup = (props) =>
  useGlobalComponent('FilterGroup', FilterGroupBase, props);

export default FilterGroup;
