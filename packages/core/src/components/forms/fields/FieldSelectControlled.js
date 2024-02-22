import { useCallback, useMemo } from 'react';
import FieldInputControlled from './FieldInputControlled';
import { useGlobalComponent } from '../../../hooks/overrides';

export const FieldSelectControlledBase = ({ children, title, ...props }) => {
  const options = useMemo(() => {
    if (!title) return children;

    return [
      <option key="placeholder" disabled value="-1">
        {title}
      </option>,
      ...(children ? children : [])
    ];
  }, [children, title]);

  const accessor = useCallback((value) => value || '-1', []);

  return (
    <FieldInputControlled type="select" accessor={accessor} {...props}>
      {options}
    </FieldInputControlled>
  );
};

const FieldSelectControlled = (props) =>
  useGlobalComponent('FieldSelectControlled', FieldSelectControlledBase, props);

export default FieldSelectControlled;
