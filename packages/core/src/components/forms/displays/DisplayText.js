import { useCallback } from 'react';
import FieldInputControlled from '../fields/FieldInputControlled';

const DisplayText = ({ empty = '-', ...props }) => {
  const accessor = useCallback(
    (value) => {
      if (!value) return empty;

      return value;
    },
    [empty]
  );

  return (
    <FieldInputControlled
      type="textarea"
      accessor={accessor}
      readOnly
      {...props}
    />
  );
};

export default DisplayText;
