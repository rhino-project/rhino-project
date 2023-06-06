import { useCallback } from 'react';
import DisplayString from 'rhino/components/forms/displays/DisplayString';
import { useGlobalComponent } from 'rhino/hooks/overrides';

const ModelDisplayReferenceBase = ({ model, ...props }) => {
  const accessor = useCallback((value) => value?.display_name, []);

  return <DisplayString accessor={accessor} {...props} />;
};

const ModelDisplayReference = (props) =>
  useGlobalComponent('ModelDisplayReference', ModelDisplayReferenceBase, props);

export default ModelDisplayReference;
