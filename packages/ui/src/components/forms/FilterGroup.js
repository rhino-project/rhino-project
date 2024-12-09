import { useGlobalComponent, useOverrides } from '@rhino-project/core/hooks';
import { FilterLayoutVertical } from './FilterLayoutVertical';

const defaultComponents = {
  FilterLayout: FilterLayoutVertical
};

export const FilterGroupBase = ({ overrides, ...props }) => {
  const { FilterLayout } = useOverrides(defaultComponents, overrides);

  return <FilterLayout {...props} />;
};

export const FilterGroup = (props) =>
  useGlobalComponent('FilterGroup', FilterGroupBase, props);
