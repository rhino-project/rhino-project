import { Fragment } from 'react';
import { useModel } from 'rhino/hooks/models';
import { useGlobalOverrides } from 'rhino/hooks/overrides';
import { getModelAndAttributeFromPath } from 'rhino/utils/models';

const defaultComponents = { ModelFooter: Fragment };

export const ModelFooter = ({ overrides, path, ...props }) => {
  const { ModelFooter } = useGlobalOverrides(defaultComponents, overrides);
  const model = useModel(props.model);

  const [, attribute] = getModelAndAttributeFromPath(model, path);

  return <ModelFooter>{attribute?.readableName || null}</ModelFooter>;
};

export default ModelFooter;
