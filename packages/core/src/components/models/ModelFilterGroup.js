import {
  useGlobalComponentForModel,
  useMergedOverrides
} from 'rhino/hooks/overrides';
import FilterGroup from '../forms/FilterGroup';
import ModelFilter from './ModelFilter';
import ModelFilterLabel from './ModelFilterLabel';

const BASE_OVERRIDES = {
  FilterLayout: { FilterLabel: ModelFilterLabel, Filter: ModelFilter }
};

const ModelFilterGroupBase = ({ ...props }) => {
  const overrides = useMergedOverrides(BASE_OVERRIDES, props.overrides);

  return <FilterGroup overrides={overrides} {...props} />;
};

const ModelFilterGroup = (props) =>
  useGlobalComponentForModel('ModelFilterGroup', ModelFilterGroupBase, props);

export default ModelFilterGroup;
