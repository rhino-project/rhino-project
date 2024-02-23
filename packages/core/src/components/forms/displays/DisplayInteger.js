import { useCallback } from 'react';
import { FieldInputControlledBase } from '../fields/FieldInputControlled';
import { useGlobalComponent } from '../../../hooks/overrides';

export const DisplayIntegerBase = ({ empty = '-', ...props }) => {
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

const DisplayInteger = (props) =>
  useGlobalComponent('DisplayInteger', DisplayIntegerBase, props);

export default DisplayInteger;
