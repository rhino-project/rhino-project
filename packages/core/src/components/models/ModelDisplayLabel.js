import { useMemo } from 'react';
import { useGlobalComponentForModel } from 'rhino/hooks/overrides';
import DisplayLabel from '../forms/DisplayLabel';
import { useModelAndAttributeFromPath } from 'rhino/hooks/models';

export const ModelDisplayLabelBase = ({
  overrides,
  label,
  model,
  ...props
}) => {
  const { attribute } = useModelAndAttributeFromPath(model, props.path);

  const modelLabel = useMemo(
    () => label || attribute.readableName,
    [attribute, label]
  );

  return <DisplayLabel label={modelLabel} {...props} />;
};

const ModelDisplayLabel = (props) =>
  useGlobalComponentForModel('ModelDisplayLabel', ModelDisplayLabelBase, props);

export default ModelDisplayLabel;
