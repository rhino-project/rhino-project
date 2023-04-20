import { useCallback } from 'react';
import DisplayArray from 'rhino/components/forms/displays/DisplayArray';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

export const ModelDisplayArrayReferenceBase = ({ model, ...props }) => {
  const accessor = useCallback(
    (value) => value?.map((v) => v.display_name)?.join(', '),
    []
  );

  return <DisplayArray accessor={accessor} {...props} />;
};

const defaultComponents = {
  ModelDisplayArrayReference: ModelDisplayArrayReferenceBase
};

const ModelDisplayArrayReference = ({ overrides, ...props }) => {
  const { ModelDisplayArrayReference } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelDisplayArrayReference {...props} />;
};

export default ModelDisplayArrayReference;
