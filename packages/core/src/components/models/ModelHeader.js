import { useGlobalOverrides } from 'rhino/hooks/overrides';
import { useModelAndAttributeFromPath } from 'rhino/hooks/paths';

export const ModelHeaderBase = ({ overrides, model, path, ...props }) => {
  const { attribute } = useModelAndAttributeFromPath(model, path);

  return <div {...props}>{attribute?.readableName || null}</div>;
};

const defaultComponents = { ModelHeader: ModelHeaderBase };

const ModelHeader = ({ overrides, label, ...props }) => {
  const { ModelHeader } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelHeader {...props} />;
};

export default ModelHeader;
