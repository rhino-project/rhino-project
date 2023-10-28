import { useCallback } from 'react';
import DisplayString from 'rhino/components/forms/displays/DisplayString';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';

// eslint-disable-next-line no-unused-vars
export const ModelDisplayReferenceBase = ({ model, ...props }) => {
  const accessor = useCallback((value) => value?.display_name, []);

  return <DisplayString accessor={accessor} {...props} />;
};

const ModelDisplayReference = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayReference',
    ModelDisplayReferenceBase,
    props
  );

export default ModelDisplayReference;
