import { useCallback } from 'react';
import FieldInputControlled from '../fields/FieldInputControlled';

const DisplayFloat = ({ empty = '-', ...props }) => {
  const accessor = useCallback(
    (value) => {
      if (value == null) return empty;

      return value;
    },
    [empty]
  );

  return (
    <FieldInputControlled type="text" accessor={accessor} readOnly {...props} />
  );
};

export default DisplayFloat;
