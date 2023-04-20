import { useCallback } from 'react';
import { format as dateFormat, parseISO } from 'date-fns';
import FieldInputControlled from '../fields/FieldInputControlled';

const DisplayTime = ({ format = 'MMMM d, yyyy', empty = '-', ...props }) => {
  const accessor = useCallback(
    (value) => {
      if (!value) return empty;

      return dateFormat(parseISO(value), format);
    },
    [empty, format]
  );

  return (
    <FieldInputControlled type="text" accessor={accessor} readOnly {...props} />
  );
};

export default DisplayTime;
