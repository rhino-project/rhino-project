import { useCallback } from 'react';
import { useGlobalComponent } from '../../../hooks/overrides';
import DisplayString from './DisplayString';

export const DisplayArrayReferenceBase = (props) => {
  const accessor = useCallback(
    (value) => value?.map((v) => v.display_name)?.join(', '),
    []
  );

  return <DisplayString {...props} accessor={accessor} />;
};

const DisplayArrayReference = (props) =>
  useGlobalComponent('DisplayArrayReference', DisplayArrayReferenceBase, props);

export default DisplayArrayReference;
