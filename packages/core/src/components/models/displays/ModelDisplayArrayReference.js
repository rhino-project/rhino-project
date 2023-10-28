import { useCallback } from 'react';
import DisplayArray from 'rhino/components/forms/displays/DisplayArray';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';

// eslint-disable-next-line no-unused-vars
export const ModelDisplayArrayReferenceBase = ({ model, ...props }) => {
  const accessor = useCallback(
    (value) => value?.map((v) => v.display_name)?.join(', '),
    []
  );

  return <DisplayArray accessor={accessor} {...props} />;
};

const ModelDisplayArrayReference = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayArrayReference',
    ModelDisplayArrayReferenceBase,
    props
  );

export default ModelDisplayArrayReference;
