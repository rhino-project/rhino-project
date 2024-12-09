import { useCallback } from 'react';
import { useGlobalComponent } from '@rhino-project/core/hooks';
import { DisplayString } from './DisplayString';

export const DisplayReferenceBase = (props) => {
  const accessor = useCallback((value) => value?.display_name, []);

  return <DisplayString {...props} accessor={accessor} />;
};

export const DisplayReference = (props) =>
  useGlobalComponent('DisplayReference', DisplayReferenceBase, props);
