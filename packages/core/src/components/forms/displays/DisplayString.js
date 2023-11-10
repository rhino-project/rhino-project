import { useCallback } from 'react';
import { FieldInputControlledBase } from '../fields/FieldInputControlled';
import { useGlobalComponent } from 'rhino/hooks/overrides';

export const DisplayStringBase = ({
  accessor: propAccessor,
  empty = '-',
  ...props
}) => {
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
    <FieldInputControlledBase
      type="text"
      accessor={accessor}
      readOnly
      {...props}
    />
  );
};

const DisplayString = (props) =>
  useGlobalComponent('DisplayString', DisplayStringBase, props);

export default DisplayString;
