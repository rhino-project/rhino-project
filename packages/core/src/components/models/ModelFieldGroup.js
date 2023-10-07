import {
  useGlobalComponentForModel,
  useOverrides
} from 'rhino/hooks/overrides';
import FieldGroup from '../forms/FieldGroup';
import ModelFieldLabel from './ModelFieldLabel';
import ModelField from './ModelField';
import { useMemo } from 'react';
import ModelFieldLayout from './ModelFieldLayout';
import { useModelContext } from 'rhino/hooks/models';

const defaultComponents = {
  ModelFieldLayout,
  ModelFieldLabel,
  ModelField
};

export const ModelFieldGroupBase = ({ overrides, ...props }) => {
  const { model } = useModelContext();
  const { ModelFieldLayout, ModelFieldLabel, ModelField } = useOverrides(
    defaultComponents,
    overrides
  );
  const combinedOverrides = useMemo(() => {
    return {
      FieldLayout: {
        component: ModelFieldLayout,
        FieldLabel: ModelFieldLabel,
        Field: ModelField
      }
    };
  }, [ModelField, ModelFieldLabel, ModelFieldLayout]);

  return <FieldGroup overrides={combinedOverrides} model={model} {...props} />;
};

const ModelFieldGroup = (props) =>
  useGlobalComponentForModel('ModelFieldGroup', ModelFieldGroupBase, props);

export default ModelFieldGroup;
