import { Fragment } from 'react';
import { useModel } from 'rhino/hooks/models';
import { useGlobalOverrides } from 'rhino/hooks/overrides';
import { getModelAndAttributeFromPath } from 'rhino/utils/models';

const defaultComponents = { ModelHeader: Fragment };

export const ModelHeader = ({ overrides, label, path, ...props }) => {
  const { ModelHeader } = useGlobalOverrides(defaultComponents, overrides);
  const model = useModel(props.model);

  const [, attribute] = getModelAndAttributeFromPath(model, path);

  return <ModelHeader>{attribute?.readableName || null}</ModelHeader>;
};

export default ModelHeader;
