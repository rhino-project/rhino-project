import { useGlobalOverrides } from 'rhino/hooks/overrides';
import { useModelAndAttributeFromPath } from 'rhino/hooks/paths';

export const ModelFooterBase = ({ overrides, model, path, ...props }) => {
  const { attribute } = useModelAndAttributeFromPath(model, path);

  return <div {...props}>{attribute?.readableName || null}</div>;
};

const defaultComponents = { ModelFooter: ModelFooterBase };

const ModelFooter = ({ overrides, ...props }) => {
  const { ModelFooter } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelFooter {...props} />;
};

export default ModelFooter;
