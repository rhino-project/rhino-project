import { useMemo } from 'react';
import { useGlobalComponentForModel } from '../../hooks/overrides';
import { DisplayLabel } from '../forms/DisplayLabel';
import { useModelAndAttributeFromPath } from '../../hooks/models';

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
