import { useCallback } from 'react';
import { FieldInputControlledBase } from '../fields/FieldInputControlled';
import { useGlobalComponent } from '../../../hooks/overrides';

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

const DisplayFloat = (props) =>
  useGlobalComponent('DisplayFloat', DisplayFloatBase, props);

export default DisplayFloat;
