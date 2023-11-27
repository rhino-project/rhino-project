import { useCallback } from 'react';
import { useGlobalComponent } from 'rhino/hooks/overrides';
import DisplayString from './DisplayString';

export const DisplayReferenceBase = (props) => {
  const accessor = useCallback((value) => value?.display_name, []);

  return <DisplayString {...props} accessor={accessor} />;
};

const DisplayReference = (props) =>
  useGlobalComponent('DisplayReference', DisplayReferenceBase, props);

export default DisplayReference;
