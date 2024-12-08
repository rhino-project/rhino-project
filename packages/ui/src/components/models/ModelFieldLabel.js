import { useMemo } from 'react';
import { useGlobalComponentForModel } from '@rhino-project/core/hooks';
import { FieldLabel } from '../forms/FieldLabel';
import { useModelAndAttributeFromPath } from '@rhino-project/core/hooks';

export const ModelFieldLabelBase = ({ label, model, ...props }) => {
  const { path } = props;
  const { attribute } = useModelAndAttributeFromPath(model, path);

  const modelLabel = useMemo(
    () => label || attribute.readableName,
    [attribute, label]
  );

  return (
    <FieldLabel
      label={modelLabel}
      required={!!attribute['x-rhino-required']}
      {...props}
    />
  );
};

export const ModelFieldLabel = (props) =>
  useGlobalComponentForModel('ModelFieldLabel', ModelFieldLabelBase, props);
