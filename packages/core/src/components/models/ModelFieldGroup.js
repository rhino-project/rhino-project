import { useGlobalComponent, useMergedOverrides } from 'rhino/hooks/overrides';
import FieldGroup from '../forms/FieldGroup';
import ModelFieldLabel from './ModelFieldLabel';
import ModelField from './ModelField';

const BASE_OVERRIDES = {
  FieldLayout: { FieldLabel: ModelFieldLabel, Field: ModelField }
};

export const ModelFieldGroupBase = ({ ...props }) => {
  const overrides = useMergedOverrides(BASE_OVERRIDES, props.overrides);

  return <FieldGroup overrides={overrides} {...props} />;
};

const ModelFieldGroup = (props) =>
  useGlobalComponent('ModelFieldGroup', ModelFieldGroupBase, props);

export default ModelFieldGroup;
