import { useMemo } from 'react';
import { useGlobalOverrides } from 'rhino/hooks/overrides';
import FieldLabel from '../forms/FieldLabel';
import { useModelAndAttributeFromPath } from 'rhino/hooks/models';

const defaultComponents = {
  ModelFieldLabel: FieldLabel
};

export const ModelFieldLabel = ({ overrides, label, model, ...props }) => {
  const { ModelFieldLabel } = useGlobalOverrides(defaultComponents, overrides, {
    model,
    ...props
  });

  const { path } = props;
  const { attribute } = useModelAndAttributeFromPath(model, path);

  const modelLabel = useMemo(() => label || attribute.readableName, [
    attribute,
    label
  ]);

  return (
    <ModelFieldLabel
      label={modelLabel}
      required={!!attribute['x-rhino-required']}
      {...props}
    />
  );
};

export default ModelFieldLabel;
