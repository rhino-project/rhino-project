import { useCallback } from 'react';
import { useGlobalComponent } from 'rhino/hooks/overrides';
import DisplayString from './DisplayString';

export const DisplayArrayBase = (props) => {
  const accessor = useCallback((value) => {
    return value?.map((v) => v)?.join(', ');
  }, []);

  return <DisplayString type="text" accessor={accessor} readOnly {...props} />;
};

const DisplayArray = (props) =>
  useGlobalComponent('DisplayArray', DisplayArrayBase, props);

export default DisplayArray;
