import { useGlobalOverrides, useMergedOverrides } from 'rhino/hooks/overrides';
import FieldGroup from '../forms/FieldGroup';
import ModelFieldLabel from './ModelFieldLabel';
import ModelField from './ModelField';

const defaultComponents = {
  ModelFieldGroup: FieldGroup
};

const BASE_OVERRIDES = {
  FieldLayout: { FieldLabel: ModelFieldLabel, Field: ModelField }
};

const ModelFieldGroup = ({ ...props }) => {
  const overrides = useMergedOverrides(BASE_OVERRIDES, props.overrides);

  const { ModelFieldGroup } = useGlobalOverrides(defaultComponents, {
    ModelFieldGroup: { ...overrides }
  });

  return <ModelFieldGroup overrides={overrides} {...props} />;
};

export default ModelFieldGroup;
