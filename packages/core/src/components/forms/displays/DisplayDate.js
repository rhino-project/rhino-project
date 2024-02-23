import { useCallback } from 'react';
import { format as dateFormat, parseISO } from 'date-fns';
import { FieldInputControlledBase } from '../fields/FieldInputControlled';
import { useGlobalComponent } from '../../../hooks/overrides';

export const DisplayDateBase = ({
  format = 'MMMM d, yyyy',
  empty = '-',
  ...props
}) => {
  const accessor = useCallback(
    (value) => {
      if (!value) return empty;

      return dateFormat(parseISO(value), format);
    },
    [empty, format]
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

export const DisplayDate = (props) =>
  useGlobalComponent('DisplayDate', DisplayDateBase, props);
