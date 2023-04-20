import { useCallback } from 'react';
import DisplayString from 'rhino/components/forms/displays/DisplayString';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const ModelDisplayReferenceBase = ({ model, ...props }) => {
  const accessor = useCallback((value) => value?.display_name, []);

  return <DisplayString accessor={accessor} {...props} />;
};

const defaultComponents = { ModelDisplayReference: ModelDisplayReferenceBase };

const ModelDisplayReference = ({ overrides, ...props }) => {
  const { ModelDisplayReference } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelDisplayReference {...props} />;
};

export default ModelDisplayReference;
