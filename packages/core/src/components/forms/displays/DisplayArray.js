import { useCallback } from 'react';
import FieldInputControlled from '../fields/FieldInputControlled';

const DisplayArray = ({ accessor: propAccessor, empty = '-', ...props }) => {
  const accessor = useCallback(
    (value) => {
      // If the accessor prop is defined, use it to get the value to display.
      const newValue = propAccessor ? propAccessor(value) : value;

      if (newValue == null) return empty;

      return newValue;
    },
    [empty, propAccessor]
  );

  return (
    <FieldInputControlled type="text" accessor={accessor} readOnly {...props} />
  );
};

export default DisplayArray;
