import { useCallback } from 'react';
import { FieldInputControlledBase } from '../fields/FieldInputControlled';
import { useGlobalComponent } from '@rhino-project/core/hooks';
export const DisplayFloatBase = ({ empty = '-', ...props }) => {
  const accessor = useCallback(
    (value) => {
      if (value == null) return empty;

      return value;
    },
    [empty]
  );

  return (
    <FieldInputControlledBase
      type="text"
      accessor={accessor}
      readOnly
      {...props}
    />
  );
};

export const DisplayFloat = (props) =>
  useGlobalComponent('DisplayFloat', DisplayFloatBase, props);
