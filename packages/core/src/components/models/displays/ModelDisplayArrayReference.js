import { useCallback } from 'react';
import DisplayArray from 'rhino/components/forms/displays/DisplayArray';
import { useGlobalComponent } from 'rhino/hooks/overrides';

export const ModelDisplayArrayReferenceBase = ({ model, ...props }) => {
  const accessor = useCallback(
    (value) => value?.map((v) => v.display_name)?.join(', '),
    []
  );

  return <DisplayArray accessor={accessor} {...props} />;
};

const ModelDisplayArrayReference = (props) =>
  useGlobalComponent(
    'ModelDisplayArrayReference',
    ModelDisplayArrayReferenceBase,
    props
  );

export default ModelDisplayArrayReference;
