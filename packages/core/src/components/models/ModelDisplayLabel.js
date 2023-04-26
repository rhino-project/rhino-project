import { useMemo } from 'react';
import { useGlobalOverrides } from 'rhino/hooks/overrides';
import DisplayLabel from '../forms/DisplayLabel';
import { useModelAndAttributeFromPath } from 'rhino/hooks/models';

const defaultComponents = {
  ModelDisplayLabel: DisplayLabel
};

export const ModelDisplayLabel = ({ overrides, label, model, ...props }) => {
  const { ModelDisplayLabel } = useGlobalOverrides(
    defaultComponents,
    overrides,
    // FIXME model should not have to be extract here - inheritedProps should be passed to the component
    { model, ...props }
  );

  const { attribute } = useModelAndAttributeFromPath(model, props.path);

  const modelLabel = useMemo(() => label || attribute.readableName, [
    attribute,
    label
  ]);

  return <ModelDisplayLabel label={modelLabel} {...props} />;
};

export default ModelDisplayLabel;
