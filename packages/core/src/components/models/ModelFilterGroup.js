import { useGlobalOverrides, useMergedOverrides } from 'rhino/hooks/overrides';
import FilterGroup from '../forms/FilterGroup';
import ModelFilter from './ModelFilter';
import ModelFilterLabel from './ModelFilterLabel';

const defaultComponents = {
  ModelFilterGroup: FilterGroup
};

const BASE_OVERRIDES = {
  FilterLayout: { FilterLabel: ModelFilterLabel, Filter: ModelFilter }
};

const ModelFilterGroup = ({ ...props }) => {
  const overrides = useMergedOverrides(BASE_OVERRIDES, props.overrides);

  const { ModelFilterGroup } = useGlobalOverrides(defaultComponents, {
    ModelFilterGroup: { ...overrides }
  });

  return <ModelFilterGroup overrides={overrides} {...props} />;
};

export default ModelFilterGroup;
