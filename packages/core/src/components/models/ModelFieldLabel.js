import { useMemo } from 'react';
import { useGlobalComponent } from 'rhino/hooks/overrides';
import FieldLabel from '../forms/FieldLabel';
import { useModelAndAttributeFromPath } from 'rhino/hooks/models';

export const ModelFieldLabelBase = ({ overrides, label, model, ...props }) => {
  const { path } = props;
  const { attribute } = useModelAndAttributeFromPath(model, path);

  const modelLabel = useMemo(() => label || attribute.readableName, [
    attribute,
    label
  ]);

  return (
    <FieldLabel
      label={modelLabel}
      required={!!attribute['x-rhino-required']}
      {...props}
    />
  );
};

const ModelFieldLabel = (props) =>
  useGlobalComponent('ModelFieldLabel', ModelFieldLabelBase, props);

export default ModelFieldLabel;
