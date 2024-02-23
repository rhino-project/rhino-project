import { useCallback } from 'react';
import { FieldInputControlledBase } from '../fields/FieldInputControlled';
import { useGlobalComponent } from '../../../hooks/overrides';

export const DisplayTextBase = ({ empty = '-', ...props }) => {
  const accessor = useCallback(
    (value) => {
      if (!value) return empty;

      return value;
    },
    [empty]
  );

  return (
    <FieldInputControlledBase
      type="textarea"
      accessor={accessor}
      readOnly
      {...props}
    />
  );
};

export const DisplayText = (props) =>
  useGlobalComponent('DisplayText', DisplayTextBase, props);
