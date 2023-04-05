import { useGlobalOverrides, useMergedOverrides } from 'rhino/hooks/overrides';
import DisplayGroup from '../forms/DisplayGroup';
import ModelDisplayLabel from './ModelDisplayLabel';
import ModelDisplay from './ModelDisplay';

const defaultComponents = {
  ModelDisplayGroup: DisplayGroup
};

const BASE_OVERRIDES = {
  DisplayLayout: {
    DisplayLabel: ModelDisplayLabel,
    Display: ModelDisplay
  }
};

const ModelDisplayGroup = ({ ...props }) => {
  const overrides = useMergedOverrides(BASE_OVERRIDES, props.overrides);

  const { ModelDisplayGroup } = useGlobalOverrides(
    defaultComponents,
    {
      ModelFilterGroup: { ...overrides }
    },
    props
  );

  return <ModelDisplayGroup overrides={overrides} {...props} />;
};

export default ModelDisplayGroup;
