import { useGlobalComponent, useMergedOverrides } from 'rhino/hooks/overrides';
import DisplayGroup from '../forms/DisplayGroup';
import ModelDisplayLabel from './ModelDisplayLabel';
import ModelDisplay from './ModelDisplay';

const BASE_OVERRIDES = {
  DisplayLayout: {
    DisplayLabel: ModelDisplayLabel,
    Display: ModelDisplay
  }
};

export const ModelDisplayGroupBase = ({ ...props }) => {
  const overrides = useMergedOverrides(BASE_OVERRIDES, props.overrides);

  return <DisplayGroup overrides={overrides} {...props} />;
};

const ModelDisplayGroup = (props) =>
  useGlobalComponent('ModelDisplayGroup', ModelDisplayGroupBase, props);

export default ModelDisplayGroup;
