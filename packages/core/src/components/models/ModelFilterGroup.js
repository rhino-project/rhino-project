import { useGlobalComponentForModel, useMergedOverrides } from '../../hooks/overrides';
import { FilterGroup } from '../forms/FilterGroup';
import { ModelFilter } from './ModelFilter';
import { ModelFilterLabel } from './ModelFilterLabel';

const BASE_OVERRIDES = {
  FilterLayout: { FilterLabel: ModelFilterLabel, Filter: ModelFilter }
};

const ModelFilterGroupBase = ({ ...props }) => {
  const overrides = useMergedOverrides(BASE_OVERRIDES, props.overrides);

  return <FilterGroup overrides={overrides} {...props} />;
};

export const ModelFilterGroup = (props) =>
  useGlobalComponentForModel('ModelFilterGroup', ModelFilterGroupBase, props);
