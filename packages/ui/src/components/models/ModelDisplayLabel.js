import { useMemo } from 'react';
import { useGlobalComponentForModel } from '@rhino-project/core/hooks';
import { DisplayLabel } from '../forms/DisplayLabel';
import { useModelAndAttributeFromPath } from '@rhino-project/core/hooks';

export const ModelDisplayLabelBase = ({ label, model, ...props }) => {
  const { attribute } = useModelAndAttributeFromPath(model, props.path);

  const modelLabel = useMemo(
    () => label || attribute.readableName,
    [attribute, label]
  );

  return <DisplayLabel label={modelLabel} {...props} />;
};

export const ModelDisplayLabel = (props) =>
  useGlobalComponentForModel('ModelDisplayLabel', ModelDisplayLabelBase, props);
