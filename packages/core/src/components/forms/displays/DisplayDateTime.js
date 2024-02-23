import { useCallback } from 'react';
import { format as dateFormat, parseISO } from 'date-fns';
import { FieldInputControlledBase } from '../fields/FieldInputControlled';
import { useGlobalComponent } from '../../../hooks/overrides';

export const DisplayDateTimeBase = ({
  format = 'MMMM d, yyyy h:mm aa',
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

export const DisplayDateTime = (props) =>
  useGlobalComponent('DisplayDateTime', DisplayDateTimeBase, props);
